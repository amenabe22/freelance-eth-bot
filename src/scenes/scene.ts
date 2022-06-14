import { Scenes } from "telegraf"


export class CoreScene extends Scenes.WizardScene<any>{
    constructor(
        id: string, steps: any,
        middlewares?: Array<any>,
    ) {
        super(id, ...steps.handlers)
        if (steps.enter) this.enter(steps.enter)
        middlewares?.forEach((e: any) => {
            this.hears(e.key, e.handler)
        })
    }
}
