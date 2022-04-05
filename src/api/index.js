// 把四个模块的接口 统一暴露
import * as tradeMark from './product/tradeMark'
import * as attr from './product/attr'
import * as sku from './product/sku'
import * as spu from './product/spu'

// 引入权限相关额接口
import * as user from './acl/user'
import role from './acl/role'
import permission from './acl/permission'
//对外暴露
export default {
    tradeMark,
    attr,
    sku,
    spu,
    user,
    role,
    permission,
}