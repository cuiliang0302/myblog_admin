import {createStore} from 'vuex'
import mutations from '@/store/mutations'
import state from "@/store/state";
import createVuexAlong from 'vuex-along'
import Vuex from 'vuex';

export default new Vuex.Store({
	state,
	mutations,
	plugins: [
		createVuexAlong({
			local: {
				list: [],
			},
			session: {
				list: [],
			}
		})
	]
})
