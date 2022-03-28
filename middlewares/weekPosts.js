const calculeDate = (date)=>{
    let ourDay = new Date()
    let postDay = new Date(`${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}`)
    let time = ourDay.getTime() - postDay.getTime()
    const days = time/(1000 * 3600 * 24)
    return days
}
exports.weeks = (x)=>{
    let posts =x.filter((e)=>{ 
        return calculeDate(e.date)<=7
    })
    return posts
}