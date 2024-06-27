import * as yup from 'yup';

const schemas = {
    create: yup.object({
        name: yup.string().required(),
        email: yup.string().required(),
        password: yup.string().required()
    }),
    auth: yup.object({
        email: yup.string().required(),
        password: yup.string().required()
    })
}

export default schemas;