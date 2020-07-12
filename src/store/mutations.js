const mutations = {
  addCart(state,info) {
    // 1.查看是否添加过   每个数组元素用item代替，code为他的键，返回找到的数组元素对象
    const oldInfo = state.cartList.find( item => item.iid === info.iid )

    // 2.+1或者新添加
    if(oldInfo) {
      oldInfo.count +=1;
    } else {
      info.count = 1;
      info.checked = true;
      state.cartList.push( info );
    }
  }
}

export default mutations;
