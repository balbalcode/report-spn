import {s3Service} from '@/api/s3.service/s3';
console

const state = () => ({})

const getters = {}

const actions = {
    async getPreSignedPostUrl({ commit }, payload) {
        return await s3Service.getPreSignedPost(payload).then(data => {
            return data
        }).catch((e) => {
            throw e
        })
    },

    async uploadDataToS3({commit}, payload) {
        return await s3Service.signedPost(payload.preSigned, payload.file).then(data => {
            return data
        }).catch((e) => {
            throw e
        })
    }
}

const mutations = {}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};




