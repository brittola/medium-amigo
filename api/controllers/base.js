export default class BaseController {
    handleError(err, res) {
        console.log(err.name, 'error name');
        return res.status(500).json({ error: err?.message });
    }

    handleResponse(data, res) {
        console.log(data, 'data');

        return res.status(200).json({ data });
    }
}
