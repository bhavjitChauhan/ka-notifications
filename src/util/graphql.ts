import {
  GeneralResponse,
  FeedbackRequestType,
  FeedbackResponseType,
  graphQLVariables
} from "../@types/extension";
import { FeedbackQueryResponse } from "../@types/graphql";
import graphQLQueries from "../json/graphql-queries.json";
import { getLatestMutation, getLatestQuery } from "@bhavjit/khan-api";

/**
 * Executes a fetch to Khan Academy's GraphQL API.
 *
 * @param queryName - The name of the GraphQL query.
 * @param fkey - The authorization key used for requests.
 * @param variables - The inputs for the GraphQL function.
 * @returns A Promise that resolves with the response or rejects if the fetch fails.
 */
export async function graphQLFetch(
  queryName:
    | "AddFeedbackToDiscussion"
    | "clearBrandNewNotifications"
    | "feedbackQuery"
    | "getFeedbackRepliesPage"
    | "getFullUserProfile"
    | "getNotificationsForUser",
  fkey: string,
  variables: graphQLVariables = {}
): Promise<Response> {
  return await new Promise((resolve, reject) => {
    // Implement fastly phrase to match safelist regex, pushing ratelimit to 100 tps for any Khan Academy GraphQL call
    const requestUrl =
      "https://www.khanacademy.org/api/internal/graphql/" +
      queryName +
      "?/fastly/";

    // British request object
    const requestInit: RequestInit = {
      method: "POST",
      headers: {
        "X-KA-fkey": fkey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        operationName: queryName,
        query: graphQLQueries[queryName],
        variables
      }),
      credentials: "same-origin"
    };

    fetch(requestUrl, requestInit)
      .then(async (response: Response) => {
        if (response.status === 200) {
          resolve(response);
          return;
        } else if (response.status === 403) {
          // Stolen from KA Extension implementation by Aliquis
          // https://github.com/ka-extension/ka-extension-ts/blob/master/src/util/graphql-util.ts#L64
          const isMutation: boolean = graphQLQueries[queryName].startsWith(
            "mutation"
          );
          console.warn(
            `The query for operation "${queryName}" is no longer in the safelist. Attempting to fetch the latest version from the safelist...`
          );
          const latestQuery: string | null = isMutation
            ? await getLatestMutation(queryName)
            : await getLatestQuery(queryName);

          if (!latestQuery) {
            throw new Error(
              `The query for operation "${queryName}" was not found in the safelist`
            );
          }

          requestInit.body = JSON.stringify({
            operationName: queryName,
            query: latestQuery,
            variables
          });

          return fetch(requestUrl, requestInit).then((response: Response) => {
            if (response.status === 200) {
              graphQLQueries[queryName] = latestQuery;
              resolve(response);
            } else {
              reject(
                `Error in GraphQL "${queryName}" call: Server responded  with status ${response.status}.`
              );
            }
          });
        }
        reject(
          `Error in GraphQL "${queryName}" call: Server responded  with status ${response.status}.`
        );
      })
      .catch(reject);
  });
}

/**
 * Retrieves user fkey cookie from Khan Academy.
 * @returns fkey cookie value or rejects if no cookie was found.
 */
export async function getUserFkeyCookie(): Promise<string> {
  return await new Promise((resolve, reject) => {
    chrome.cookies.get(
      {
        url: "https://www.khanacademy.org",
        name: "fkey"
      },
      cookie => {
        if (cookie === null) {
          reject("No fkey cookie found.");
          return;
        }
        resolve(cookie.value);
      }
    );
  });
}

/**
 * Better error handling for graphQL calls.
 * @param queryName graphQL query name.
 * @param fkey cookie is required to make requests.
 * @returns Returns an object with either an error or a JSON value
 */
export async function graphQLFetchJsonResponse(
  queryName:
    | "AddFeedbackToDiscussion"
    | "clearBrandNewNotifications"
    | "feedbackQuery"
    | "getFeedbackRepliesPage"
    | "getFullUserProfile"
    | "getNotificationsForUser",
  fkey: string,
  variables: graphQLVariables = {}
): Promise<GeneralResponse> {
  // Optimized cookie retrieval
  let cookie: string;
  if (fkey !== undefined) {
    cookie = fkey;
  } else {
    try {
      cookie = await getUserFkeyCookie();
    } catch (e) {
      return {
        cookieError: true
      };
    }
  }

  // Attempts to fetch data and handles common errors
  let response: Response;
  try {
    response = await graphQLFetch(queryName, cookie, variables);
  } catch (e) {
    // It's possible you disconnected mid-fetch
    if (e.message === "Failed to fetch") {
      console.log(
        "Possible network disconnect detected, please check your internet connection."
      );
      return;
    }

    // Otherwise you have a geniune network error
    console.error("Error in response: ", e);
    return;
  }

  return {
    value: await response.json()
  };
}

/**
 * Sends feedback using notification properties.
 *
 * @param fkey User auth cookie
 * @param url KaNotification class property default
 * @param typename Typename of the KaNotification
 * @param feedbackType Type of feedback that this notification is
 * @param textContent The content you want to send
 * @returns A boolean that is true if the data was sent successfully
 */
export async function addFeedback(
  fkey: string,
  url: string,
  typename: string,
  feedbackType: string,
  textContent: string
): Promise<boolean> {
  let responseType: FeedbackResponseType;
  let requestType: FeedbackRequestType;
  let focusKind = "scratchpad";

  const params = new URL("https://www.khanacademy.org/" + url).searchParams;

  if (typename === "ResponseFeedbackNotification") {
    requestType = feedbackType === "ANSWER" ? "QUESTION" : "COMMENT";
    responseType = "REPLY";
    focusKind = params.get("qa_expand_type");
  } else if (typename === "ProgramFeedbackNotification") {
    requestType = feedbackType as FeedbackRequestType;
    responseType = feedbackType === "QUESTION" ? "ANSWER" : "REPLY";
  } else {
    return false;
  }

  const topicId = url
    .split("?")[0]
    .split("/")
    .pop();

  return await graphQLFetch("feedbackQuery", fkey, {
    topicId,
    feedbackType: requestType,
    currentSort: 5,
    qaExpandKey: params.get("qa_expand_key"),
    focusKind
  })
    .then(async (response: Response) => await response.json())
    .then(async (json: FeedbackQueryResponse) => {
      const feedback = json.data.feedback.feedback[0];
      const key: string =
        feedbackType === "QUESTION" && params.get("qa_expand_type") === "answer"
          ? feedback.answers[0].key
          : feedback.key;
      return await graphQLFetch("AddFeedbackToDiscussion", fkey, {
        parentKey: key,
        textContent,
        feedbackType: responseType,
        fromVideoAuthor: false,
        shownLowQualityNotice: false
      });
    })
    .then(response => response.ok)
    .catch(error => {
      console.error("Error in sending feedback: ", error);
      return false;
    });
}

export async function getJsonUserProfile() {
  const response = await fetch(
    "https://www.khanacademy.org/api/internal/graphql/getFullUserProfile?hash=2921543415"
  );
  return await response.json();
}
