// ============================================ Friend ring module
const FriendRingHomePage = () => import('../../pages/friend/FriendRingHomePage');
const FriendRingPage = () => import('../../pages/friend/FriendRingPage');
const FriendRingFilePage = () => import('../../pages/friend/FriendRingFilePage');
const FriendRingCommentPage = () => import('../../pages/friend/FriendRingCommentPage');
const FriendRingCommentLikePage = () => import('../../pages/friend/FriendRingCommentLikePage');
const FriendRingLikePage = () => import('../../pages/friend/FriendRingLikePage');

export const FriendRingModuleRouter = {
  path: 'friend',
  name: 'FriendRingHomePage',
  component: FriendRingHomePage,
  children: [
    {
      path: 'friend-ring',
      name: 'FriendRingPage',
      component: FriendRingPage
    },
    {
      path: 'friend-ring-file',
      name: 'FriendRingFilePage',
      component: FriendRingFilePage
    },
    {
      path: 'friend-ring-comment',
      name: 'FriendRingCommentPage',
      component: FriendRingCommentPage
    },
    {
      path: 'friend-ring-comment-like',
      name: 'FriendRingCommentLikePage',
      component: FriendRingCommentLikePage
    },
    {
      path: 'friend-ring-like',
      name: 'FriendRingLikePage',
      component: FriendRingLikePage
    }
  ]
}
