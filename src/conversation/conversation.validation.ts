import Joi from "joi";

const create =  Joi.object({
    type: Joi.string().valid('chat','group').required(),
    members: Joi.array().items(
        Joi.string().required()
    ),
    groupName: Joi.alternatives().conditional("type",{
        is:'group',
        then:Joi.string().required(),
        otherwise:Joi.forbidden()
    }),
    admins: Joi.alternatives().conditional("type",{
        is:'group',
        then:Joi.array().items(
            Joi.string().required()
        ),
        otherwise:Joi.forbidden()
    }),
    createdBy: Joi.string().required(),
    updatedBy: Joi.string().required(),
})

const update = Joi.object({
    groupName:Joi.string(),
})


export const conversationValidation = {
    create,
    update
}

