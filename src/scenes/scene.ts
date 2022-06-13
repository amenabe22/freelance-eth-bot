import { Middleware, Scenes } from "telegraf"


export class CoreScene extends Scenes.WizardScene<any>{
    constructor(
        id: string, steps: Array<Middleware<any>>,
        middlewares?: Array<any>,
    ) {
        super(id, ...steps)
        middlewares?.forEach((e: any) => {
            this.hears(e.key, e.handler)
        })
    }

}