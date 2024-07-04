import * as yup from 'yup';

const schemas = {
    get: {
        query: yup.object({
            page: yup.number()
                .integer('O parâmetro deve ser um número inteiro.')
                .positive('O parâmetro deve ser um número inteiro positivo.')
                .default(1)
        }).noUnknown()
    },
    getById: {
        params: yup.object({
            id: yup.number()
                .integer('O parâmetro deve ser um número inteiro.')
                .positive('O parâmetro deve ser um número inteiro positivo.')
                .required('O id do post é obrigatório.')
        }).noUnknown()
    },
    create: {
        body: yup.object({
            title: yup.string().required('O título é obrigatório.'),
            content: yup.string().required('O conteúdo é obrigatório.'),
            summary: yup.string().required('O resumo é obrigatório.'),
            available_at: yup.date().nullable().typeError('Formato de data inválido. Utilize o formato ISO8601: YYYY-MM-DDTHH:mm:ss.SSSZ')
        }).noUnknown()
    },
    update: {
        body: yup.object({
            title: yup.string().nullable(),
            content: yup.string().nullable(),
            summary: yup.string().nullable()
        }).noUnknown(),
        params: yup.object({
            id: yup.number()
                .integer('O parâmetro deve ser um número inteiro.')
                .positive('O parâmetro deve ser um número inteiro positivo.')
                .required('O id do post é obrigatório.')
        }).noUnknown()
    },
    delete: {
        params: yup.object({
            id: yup.number()
                .integer('O parâmetro deve ser um número inteiro.')
                .positive('O parâmetro deve ser um número inteiro positivo.')
                .required('O id do post é obrigatório.')
        }).noUnknown()
    },
    like: {
        params: yup.object({
            id: yup.number()
                .integer('O parâmetro deve ser um número inteiro.')
                .positive('O parâmetro deve ser um número inteiro positivo.')
                .required('O id do post é obrigatório.')
        }).noUnknown()
    },
}

export default schemas;
