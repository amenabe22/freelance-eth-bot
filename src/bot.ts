import { Telegraf, session, MiddlewareFn } from "telegraf";
import { MatchedMiddleware, Triggers } from "telegraf/typings/composer";
import { Context } from "telegraf/typings/context";

export class CoreBot {
    private instance: Telegraf<Context>;

    constructor(
        token: string,
        middlewares: MiddlewareFn<any>[],
        actions?: any[],
        commands?: any[],
        callbacks?: any[],
    ) {
        this.instance = new Telegraf(token);
        // session should always come before middlewares registration
        this.instance.use(session())

        // register all other middleware here
        middlewares.forEach((middleware: MiddlewareFn<any>) => {
            this.instance.use(middleware);
        })

        commands?.forEach((act: any) => {
            this.instance.command(act.command, act.handler)
        })
        // register all action middlewares here
        actions?.forEach((act: any) => {
            this.instance.action(act.key, act.handler)
        })
        callbacks?.forEach((cb: any) => {
            this.instance.hears(cb.key, cb.handler)
        })
        // @ts-ignore
        // this.instance.hears(localizationProvider.allTr('common.mainmenu'), ctx => MyStage.router.push(ctx, '/', true, true))
        this.instance.catch((err, ctx) => {
            console.log("===============================BOT ERROR===============================");
            console.log(err);
            console.log("*******************************BOT ERROR*******************************");
            return;
        });

    }
    start(...fns: any) {
        return this.instance.start(fns)
    }
    launch(config: Telegraf.LaunchOptions = {}) {
        return this.instance.launch(config)
    }
    action(triggers: Triggers<any>,
        ...fns: MatchedMiddleware<any, 'callback_query'>
    ) {
        return this.instance.action(triggers, ...fns)
    }
    stop(reason = 'unspecified') {
        return this.instance.stop(reason)
    }
}

