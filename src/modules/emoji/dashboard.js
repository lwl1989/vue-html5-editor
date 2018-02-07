import template from './dashboard.html'
import Command from '../../range/command'

/**
 * Created by peak on 2017/2/10.
 */
export default {
    template,
    data() {
        const prefix = '0xd83d'
        let chars = 0xde00
        const arr = []
        while (chars < 0xde50) {
            arr.push(String.fromCharCode(prefix,`0x${chars.toString(16)}`))
            chars++
        }
        return {
            url: '',
            symbols: arr
        }
    },
    methods: {
        insertIcon(icon) {
            this.$parent.execCommand(Command.INSERT_HTML, icon)
        },
        closeEmoji() {
            this.$parent.toggleDashboard()
        }
    }
}
