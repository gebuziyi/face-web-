import Vue from 'vue'
import IconTag from './IconTag'
import Affix from './Affix'
import VideoPreviewDialog from './dialogs/VideoPreviewDialog'
import TableImgPreviewer from './TableImgPreviewer'
import TableBtns from './TableBtns'
import ServerTimeClock from './ServerTimeClock'

Vue.component('icon-tag', IconTag)
Vue.component('affix', Affix)
Vue.component(VideoPreviewDialog.name, VideoPreviewDialog)
Vue.component(TableImgPreviewer.name, TableImgPreviewer)
Vue.component(TableBtns.name, TableBtns)
Vue.component(ServerTimeClock.name, ServerTimeClock)
