// ============================================ Instant message module
import AssistantHomePage from '../../pages/assistant/AssistantHomePage.vue'
import AssistantChatMsgPage from '../../pages/assistant/AssistantChatMsgPage.vue';
import OfficialActivityPublishPage from '../../pages/assistant/OfficialActivityPublishPage.vue';
import AssistantFaqType from '../../pages/assistant/AssistantFaqType.vue';

export const AssistantModuleRouter = {
  path: 'assistant',
  name: 'AssistantHomePage',
  component: AssistantHomePage,
  children: [
    {
      path: 'chat-msg',
      name: 'AssistantChatMsgPage',
      component: AssistantChatMsgPage
    },
    {
      path: 'official-activity-publish',
      name: 'OfficialActivityPublishPage',
      component: OfficialActivityPublishPage
    },
    {
      path: 'faq-type',
      name: 'AssistantFaqType',
      component: AssistantFaqType
    }
  ]
}
