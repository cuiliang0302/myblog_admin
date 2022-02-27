import {createStore} from 'vuex'
import mutations from '@/store/mutations'
import state from "@/store/state";
import createVuexAlong from 'vuex-along'

export default createStore({
	state,
	mutations,
	plugins: [
		createVuexAlong({
			local: {
				list: [],
			},
			session: {
				list: ["count"],
			}
		})
	]
})
