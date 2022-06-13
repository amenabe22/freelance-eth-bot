import { cancelKeyboard } from "../../keybaords/menu_kbs";
import { fetchEducationLevels } from "../../services/basic";
import { Telegraf } from "telegraf"

export const availablityHandler = Telegraf.on(["text", "contact", "document", "photo"], async (ctx: any) => {
    if (ctx.message.text) {
        ctx.scene.state.currentAvailablity = ctx.message.text;
        const { data, errors } = await fetchEducationLevels()
        if (!errors) {
            const { education_levels } = data;
            const educationLevelNames = education_levels.map((lvl: any) => [{ text: lvl.name }])
            ctx.reply("please choose your educational level.", {
                reply_markup: JSON.stringify({
                    keyboard: educationLevelNames
                    , resize_keyboard: true, one_time_keyboard: true,
                }),
            });
        }

        return ctx.wizard.next();
    } else {
        ctx.reply(ctx.chat.id, "Please enter a valid availablity status!", cancelKeyboard);
        return;
    }
})

export const educationalLevelHandler = Telegraf.on(["text", "contact", "document", "photo"], async (ctx: any) => {
    if (ctx.message.text) {
        ctx.scene.state.currentEducationLevel = ctx.message.text;
        console.log(ctx.scene.state.currentEducationLevel);
        function getEducationLevelId(educationalLevelName) {
            var data = JSON.stringify({
                query: `query getEducationalLevel($name: citext!) {
                        education_levels(where: {
                          name: {
                            _eq: $name
                          }
                        }) {
                        id                  
                        }
                      }`,
                variables: { "name": `${educationalLevelName}` }
            });
            var config = {
                method: 'post',
                url: process.env.HASURA_GRAPHQL_URL,
                headers: {
                    'x-hasura-admin-secret': process.env.HASURA_GRAPHQL_ADMIN_SECRET
                },
                data: data
            };
            axios(config)
                .then(function (response) {
                    let data = response.data;
                    console.log(data);
                    let educationalLevelId = data.data.education_levels[0].id;
                    ctx.session.currentEducationLevel = educationalLevelId;
                    console.log(ctx.session.currentEducationLevel);
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
        getEducationLevelId(ctx.scene.state.currentEducationLevel);
        function getWorkStatusName() {
            const results = apollo.query({
                query: gql`
                      {
                        work_statuses{
                          name
                        }
                      }
                    `,
            }).then((response) => {
                console.log(response.data)
                let data = response.data
                let workStatus = data.work_statuses;
                const workStasusName = workStatus.map((names) => {
                    return `${names.name}`
                })
                bot.telegram.sendMessage(ctx.chat.id, `please enter your work status.`, {
                    reply_markup: JSON.stringify({
                        keyboard: workStasusName.map((x, xi) => ([{
                            text: x,
                        }])), resize_keyboard: true, one_time_keyboard: true,
                    }),
                });
            })
        }
        getWorkStatusName();
        return ctx.wizard.next();
    } else {
        bot.telegram.sendMessage(ctx.chat.id, `Please enter a valid educational level!`, cancelKeyboard);
        return;
    }
})
// const workStatusHandler = Telegraf.on(["text", "contact", "document", "photo"], async (ctx) => {
//     if (ctx.message.text) {
//         ctx.scene.state.currentEmploymentStatus = ctx.message.text;
//         console.log(ctx.scene.state.currentEmploymentStatus);
//         ctx.session.currentAvailablity = ctx.scene.state.currentAvailablity;
//         ctx.session.userIdd = ctx.scene.state.userId
//         function getWorkStatusId(workStatusName) {
//             var data = JSON.stringify({
//                 query: `query getWorkStatus($name: citext!) {
//                         work_statuses(where: {
//                           name: {
//                             _eq: $name
//                           }
//                         }) {
//                         id                  
//                         }
//                       }`,
//                 variables: { "name": `${workStatusName}` }
//             });
//             var config = {
//                 method: 'post',
//                 url: process.env.HASURA_GRAPHQL_URL,
//                 headers: {
//                     'x-hasura-admin-secret': process.env.HASURA_GRAPHQL_ADMIN_SECRET
//                 },
//                 data: data
//             };
//             axios(config)
//                 .then(function (response) {
//                     let data = response.data;
//                     console.log(data);
//                     let workStatusId = data.data.work_statuses[0].id;
//                     ctx.session.currentWorkStatus = workStatusId;
//                     console.log(ctx.session.currentWorkStatus);
//                     console.log(ctx.session.currentEducationLevel);
//                     console.log(ctx.session.userIdd);
//                     console.log(ctx.session.currentAvailablity)
//                     function registerJobSeeker(userId, educationalLevelId, workStatusId) {
//                         var data = JSON.stringify({
//                             query: `mutation($obj: job_seekers_insert_input!) {
//                                 insert_job_seeker(object: $obj) {
//                                   id
//                                 }
//                               }`,
//                             variables: {
//                                 "obj": {
//                                     "user_id": `${userId}`,
//                                     "education_level_id": `${educationalLevelId}`,
//                                     "work_status_id": `${workStatusId}`
//                                 }
//                             }
//                         });
//                         var config = {
//                             method: 'post',
//                             url: process.env.HASURA_GRAPHQL_URL,
//                             headers: {
//                                 'x-hasura-admin-secret': process.env.HASURA_GRAPHQL_ADMIN_SECRET
//                             },
//                             data: data
//                         };
//                         axios(config)
//                             .then(function (response) {
//                                 let data = response.data;
//                                 console.log(data);
//                                 bot.telegram.sendMessage(ctx.chat.id, `You have successfully Registerd As Job seeker`, jobSeekerKeyboard);
//                                 ctx.scene.leave();
//                             })
//                             .catch(function (error) {
//                                 console.log(error);
//                             });
//                     }
//                     registerJobSeeker(ctx.session.userIdd, ctx.session.currentEducationLevel, ctx.session.currentWorkStatus);
//                 })
//                 .catch(function (error) {
//                     console.log(error);
//                 });
//         }
//         getWorkStatusId(ctx.scene.state.currentEmploymentStatus)

//     } else {
//         bot.telegram.sendMessage(ctx.chat.id, `Please enter a valid work status!`, cancelKeyboard);
//         return;
//     }
// })
// const registerJobSeekerScene = new WizardScene(
//     "registerJobSeekerScene",
//     availablityHandler,
//     educationalLevelHandler,
//     workStatusHandler

// )
// registerJobSeekerScene.enter((ctx) => {
//     ctx.scene.state.userId = ctx.session.userId;
//     console.log(ctx.scene.state.userId)
//     bot.telegram.sendMessage(ctx.chat.id, "Please eneter your Availability", cancelKeyboard)
// })
// const stage = new Stage([registerJobSeekerScene]);
// registerJobSeekerScene.hears("Back", (ctx) => {
//     bot.telegram.sendMessage(ctx.chat.id, `Alright ${ctx.from.first_name}, what do you like to do today?`, jobSeekerKeyboard)
// })
// bot.use(session());
// bot.use(stage.middleware());
// bot.use()

