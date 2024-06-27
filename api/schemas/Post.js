import * as yup from 'yup';

const schemas = {
    page: yup.object({
        page: yup.number()
        .integer('O parâmetro deve ser um número inteiro.')
        .positive('O parâmetro deve ser um número inteiro positivo.')
        .default(1)
    }),
    create: yup.object({
        title: yup.string().required('O título é obrigatório.'),
        content: yup.string().required('O conteúdo é obrigatório.'),
        summary: yup.string().required('O resumo é obrigatório.'),
        available_at: yup.date().nullable().typeError('Formato de data inválido. Utilize o formato ISO8601: YYYY-MM-DDTHH:mm:ss.SSSZ')
    }),
    update: yup.object({
        title: yup.string().nullable(),
        content: yup.string().nullable(),
        summary: yup.string().nullable(),
        postId: yup.number().integer().positive().required()
    }),
    postId: yup.object({
        postId: yup.number().integer().positive().required()
    })
}


export default schemas;
