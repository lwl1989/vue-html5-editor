import dashboard from './dashboard'
import './style.css'
/**
 * insert image
 * Created by peak on 16/8/18.
 */
export default {
    name: 'video',
    icon: 'fa fa-video-camera',
    i18n: 'video',
    config: {
        sizeLimit: 20 * 1024 * 1024,
        upload: {
            url: '/upload/mall/cover',
            headers: {},
            params: {},
            fieldName: 'video'
        },
        uploadHandler(responseText){
            const json = JSON.parse(responseText)
            return json.ok ? json.data : null
        }
    },
    dashboard
}
