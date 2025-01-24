export function supportIPv6(url: string): Promise<boolean> {
  return  fetch(url,{
      method: 'HEAD',
      mode: 'cors'
  }).then(res => {
      console.log(res)
      return true
   }).catch(err => {
       console.log(err)
      return false
   })
}
