import template from './dashboard.html'
import Command from '../../range/command'

/**
 * Created by peak on 2017/2/10.
 */
export default {
    template,
    data() {
        return {
            outSiteLink: '',
            file: '',
            process: '',
            upload: {
                status: 'ready', // progress,success,error,abort
                errorMsg: null,
                progressComputable: false,
                complete: 0
            }
        }
    },
    methods: {
        insertVideoUrl(){
            if (this.outSiteLink === '') {
                this.setUploadError('請輸入網址')
                return
            }
            this.insert(this.outSiteLink)
            this.outSiteLink = ''
        },
        insert(url) {
            if (url === '' || url === 'undefined') {
                this.setUploadError('插入視頻失敗，請重試')
                return
            }
            const arg = {
                url,
                width: document.getElementsByClassName('vue-html5-editor')[0].offsetWidth,
                height: document.getElementsByClassName('vue-html5-editor')[0].offsetHeight
            }
            this.$parent.execCommand(Command.INSERT_VIDEO, arg)
        },
        setUploadError(msg){
            this.upload.status = 'error'
            this.upload.errorMsg = msg
        },
        reset(){
            this.upload.status = 'ready'
            this.$refs.video.value = null
        },
        videoProcess() {
            const file = this.$refs.video.files[0]
            const config = this.$options.module.config

            if (file.size > config.sizeLimit) {
                this.setUploadError(this.$parent.locale['exceed size limit'])
                this.reset()
                return
            }

            this.uploadToServer(file)

            this.reset()
        },
        uploadToServer: function uploadToServer(file) {
            const that = this
            const config = this.$options.module.config

            const formData = new FormData()
            formData.append(config.upload.fieldName || 'image', file)

            if (typeof config.upload.params === 'object') {
                Object.keys(config.upload.params).forEach((key) => {
                    const value = config.upload.params[key]
                    if (Array.isArray(value)) {
                        value.forEach((v) => {
                            formData.append(key, v)
                        })
                    } else {
                        formData.append(key, value)
                    }
                })
            }

            const xhr = new XMLHttpRequest()

            xhr.onprogress = (e) => {
                that.upload.status = 'progress'
                if (e.lengthComputable) {
                    that.upload.progressComputable = true
                    const percentComplete = e.loaded / e.total
                    that.upload.complete = (percentComplete * 100).toFixed(2)
                } else {
                    that.upload.progressComputable = false
                }
            }

            xhr.onload = () => {
                if (xhr.status !== 200) {
                    that.setUploadError('request error')
                    return
                }

                try {
                    const json = config.uploadHandler(xhr.responseText)
                    if (json.code === 0) {
                        that.insert(json.response.file_url)
                    } else {
                        that.setUploadError(json.response.response)
                    }
                } catch (err) {
                    that.setUploadError(err.toString())
                } finally {
                    that.upload.status = 'ready'
                }
            }

            xhr.onerror = () => {
                // find network info in brower tools
                that.setUploadError('request error')
            }

            xhr.onabort = () => {
                that.upload.status = 'abort'
            }

            xhr.open('POST', config.upload.url)
            if (typeof config.upload.headers === 'object') {
                Object.keys(config.upload.headers).forEach((k) => {
                    xhr.setRequestHeader(k, config.upload.headers[k])
                })
            }
            xhr.send(formData)
        }
    }
}
