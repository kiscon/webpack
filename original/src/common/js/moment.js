import moment from 'moment'
// 手动引入语言包
import 'moment/locale/zh-cn'
// 设置语言
moment.locale('zh-CN')

console.log(moment().subtract(6, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss'))
console.log(moment().subtract(6, 'days').calendar())