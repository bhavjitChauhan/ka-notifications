// const ALARM_NAME = "ka-notification";

// If you want a faster timer, use window.setInterval
// chrome.alarms.create(ALARM_NAME, {
//   periodInMinutes: 1
// });

// chrome.alarms.onAlarm = (alarm) => {
//   if(alarm.name !== ALARM_NAME) return;
  
// };

function fetchUserData() {
  return getChromeFkey().then((fkey) => graphQLFetch("getFullUserProfile"));
}

const queries = {
  "getFullUserProfile": "query getFullUserProfile($kaid: String, $username: String) {\n  user(kaid: $kaid, username: $username) {\n    id\n    kaid\n    key\n    userId\n    email\n    username\n    profileRoot\n    gaUserId\n    qualarooId\n    isPhantom\n    isDeveloper: hasPermission(name: \"can_do_what_only_admins_can_do\")\n    isCurator: hasPermission(name: \"can_curate_tags\", scope: ANY_ON_CURRENT_LOCALE)\n    isCreator: hasPermission(name: \"has_creator_role\", scope: ANY_ON_CURRENT_LOCALE)\n    isPublisher: hasPermission(name: \"can_publish\", scope: ANY_ON_CURRENT_LOCALE)\n    isModerator: hasPermission(name: \"can_moderate_users\", scope: GLOBAL)\n    isParent\n    isSatStudent\n    isTeacher\n    isDataCollectible\n    isChild\n    isOrphan\n    isCoachingLoggedInUser\n    canModifyCoaches\n    nickname\n    hideVisual\n    joined\n    points\n    countVideosCompleted\n    bio\n    profile {\n      accessLevel\n      __typename\n    }\n    soundOn\n    muteVideos\n    showCaptions\n    prefersReducedMotion\n    noColorInVideos\n    autocontinueOn\n    newNotificationCount\n    canHellban: hasPermission(name: \"can_ban_users\", scope: GLOBAL)\n    canMessageUsers: hasPermission(name: \"can_send_moderator_messages\", scope: GLOBAL)\n    isSelf: isActor\n    hasStudents: hasCoachees\n    hasClasses\n    hasChildren\n    hasCoach\n    badgeCounts\n    homepageUrl\n    isMidsignupPhantom\n    includesDistrictOwnedData\n    canAccessDistrictsHomepage\n    preferredKaLocale {\n      id\n      kaLocale\n      status\n      __typename\n    }\n    underAgeGate {\n      parentEmail\n      daysUntilCutoff\n      approvalGivenAt\n      __typename\n    }\n    authEmails\n    signupDataIfUnverified {\n      email\n      emailBounced\n      __typename\n    }\n    pendingEmailVerifications {\n      email\n      __typename\n    }\n    tosAccepted\n    shouldShowAgeCheck\n    __typename\n  }\n  actorIsImpersonatingUser\n}\n",
  "VoteEntityMutation": "mutation VoteEntityMutation($postKey: String!, $voteType: Int!) {\n  voteEntity(entityKey: $postKey, voteType: $voteType) {\n    error {\n      code\n      __typename\n    }\n    __typename\n  }\n}\n",
  "projectsAuthoredByUser": "query projectsAuthoredByUser($kaid: String, $pageInfo: ListProgramsPageInfo, $sort: ListProgramSortOrder) {\n  user(kaid: $kaid) {\n    id\n    programs(pageInfo: $pageInfo, sort: $sort) {\n      complete\n      cursor\n      programs {\n        id\n        key\n        authorKaid\n        authorNickname\n        displayableSpinoffCount\n        imagePath\n        sumVotesIncremented\n        translatedTitle: title\n        url\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n",
  "feedbackQuery": "query feedbackQuery($topicId: String!, $focusKind: String!, $cursor: String, $limit: Int, $feedbackType: FeedbackType!, $currentSort: Int, $qaExpandKey: String) {\n  feedback(focusId: $topicId, cursor: $cursor, limit: $limit, feedbackType: $feedbackType, focusKind: $focusKind, sort: $currentSort, qaExpandKey: $qaExpandKey) {\n    feedback {\n      replyCount\n      appearsAsDeleted\n      author {\n        id\n        kaid\n        nickname\n        avatar {\n          name\n          imageSrc\n          __typename\n        }\n        __typename\n      }\n      badges {\n        name\n        icons {\n          smallUrl\n          __typename\n        }\n        description\n        __typename\n      }\n      content\n      date\n      definitelyNotSpam\n      deleted\n      downVoted\n      expandKey\n      feedbackType\n      flaggedBy\n      flaggedByUser\n      flags\n      focusUrl\n      focus {\n        kind\n        id\n        translatedTitle\n        relativeUrl\n        __typename\n      }\n      fromVideoAuthor\n      key\n      lowQualityScore\n      notifyOnAnswer\n      permalink\n      qualityKind\n      replyCount\n      replyExpandKeys\n      showLowQualityNotice\n      sumVotesIncremented\n      upVoted\n      ... on QuestionFeedback {\n        hasAnswered\n        answers {\n          replyCount\n          appearsAsDeleted\n          author {\n            id\n            kaid\n            nickname\n            avatar {\n              name\n              imageSrc\n              __typename\n            }\n            __typename\n          }\n          badges {\n            name\n            icons {\n              smallUrl\n              __typename\n            }\n            description\n            __typename\n          }\n          content\n          date\n          definitelyNotSpam\n          deleted\n          downVoted\n          expandKey\n          feedbackType\n          flaggedBy\n          flaggedByUser\n          flags\n          focusUrl\n          focus {\n            kind\n            id\n            translatedTitle\n            relativeUrl\n            __typename\n          }\n          fromVideoAuthor\n          key\n          lowQualityScore\n          notifyOnAnswer\n          permalink\n          qualityKind\n          replyCount\n          replyExpandKeys\n          showLowQualityNotice\n          sumVotesIncremented\n          upVoted\n          __typename\n        }\n        isOld\n        __typename\n      }\n      ... on AnswerFeedback {\n        question {\n          replyCount\n          appearsAsDeleted\n          author {\n            id\n            kaid\n            nickname\n            avatar {\n              name\n              imageSrc\n              __typename\n            }\n            __typename\n          }\n          badges {\n            name\n            icons {\n              smallUrl\n              __typename\n            }\n            description\n            __typename\n          }\n          content\n          date\n          definitelyNotSpam\n          deleted\n          downVoted\n          expandKey\n          feedbackType\n          flaggedBy\n          flaggedByUser\n          flags\n          focusUrl\n          focus {\n            kind\n            id\n            translatedTitle\n            relativeUrl\n            __typename\n          }\n          fromVideoAuthor\n          key\n          lowQualityScore\n          notifyOnAnswer\n          permalink\n          qualityKind\n          replyCount\n          replyExpandKeys\n          showLowQualityNotice\n          sumVotesIncremented\n          upVoted\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    cursor\n    isComplete\n    sortedByDate\n    __typename\n  }\n}\n"
}

function graphQLFetch(query, fkey) {
  return new Promise((resolve, reject) => {
    fetch("https://www.khanacademy.org/api/internal/graphql" + query, {
      method: "POST",
      headers: {
        "X-KA-fkey": fkey,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        operationName: query,
        query: queries[query]
      }),
      credentials: "same-origin"
    })
      .then((response) => {
        if (response.status === 200) resolve(response.json());
        response.text().then((body) => reject(`Error in GraphQL ${query} call: Server responded with status ${JSON.stringify(response.statusText)} and body ${JSON.stringify(body)}`));
      })
      .then((json) => resolve(json.data));
  });
}

function getChromeFkey () {
	return new Promise((resolve, reject) => {
		chrome.cookies.get({
			url: "https://www.khanacademy.org",
			name: "fkey"
		}, (cookie) => {
			if (cookie === null || !cookie) reject("fkey cookie not found.");
			resolve(cookie?.value);
		});
	});
}