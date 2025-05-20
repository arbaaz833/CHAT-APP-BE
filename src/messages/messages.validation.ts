import Joi from "joi";

const create = Joi.object({
  text: Joi.alternatives().conditional('mediaUrl',{
    is: Joi.array().items(
                Joi.string().required()
            ).min(1),
    then:Joi.forbidden(),
    otherwise: Joi.string().required()
  }),
  media: Joi.alternatives().conditional('text',{
    is: Joi.string().min(1),
    then:Joi.forbidden(),
    otherwise: Joi.array().min(1).required()
  }),
})

export const messageValidation = {
    create
}