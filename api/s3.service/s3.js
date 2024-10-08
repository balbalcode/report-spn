import {authHeader, authLocator} from '../auth-token';
import axios from 'axios'

export const s3Service = {
    getPreSignedPost, signedPost
};


function getPreSignedPost(data) {
    return axios({
        url: `${process.env.baseUrl}/v1/mgmt/presigned-url`,
        method: 'post',
        headers: authHeader(),
        data
    }).then(
        res => res.data
    ).catch(error => {
        return Promise.reject(error.response.data.message);
    });
}

async function signedPost(data, file) {
    let retr
    let formData = new FormData();
    formData.append("x-amz-security-token", data['fields']['x-amz-security-token']);
    formData.append("AWSAccessKeyId", data['fields']['AWSAccessKeyId']);
    formData.append("key", data['fields']['key']);
    formData.append("policy", data['fields']['policy']);
    formData.append("signature", data['fields']['signature']);
    formData.append("file", file);

    await axios.post(data['url'], formData).then(response => {
        retr = response
    }).catch((e) => {
        return Promise.reject(e);
    })
    return retr
}