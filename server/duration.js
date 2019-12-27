module.exports = async (ctx, next) => {
    let stime = new Date().getTime()
    await next()
    let etime = new Date().getTime()
    ctx.state.duration = etime - stime
}
