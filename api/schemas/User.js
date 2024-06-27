import * as yup from 'yup';

const schemas = {
    create: yup.object({
        name: yup.string().required("O campo 'name' é obrigatório"),
        email: yup.string().required("O campo 'email' é obrigatório"),
        password: yup.string().required("O campo 'password' é obrigatório")
    }),
    auth: yup.object({
        email: yup.string().required("O campo 'email' é obrigatório"),
        password: yup.string().required("O campo 'password' é obrigatório")
    })
}

export default schemas;