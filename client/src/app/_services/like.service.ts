import { cacheManager } from './../_helper/cache'
import { computed, inject, Injectable, Signal, signal, } from '@angular/core'
import { User } from '../_models/user'
import { AccountService } from './account.service'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../environments/environment'
import { Paginator, QueryPagination } from '../_models/pagination'
import { default_paginator } from '../_models/pagination'
import { pareQuery } from '../_helper/helper'

@Injectable({
    providedIn: 'root'
})
export class LikeService {

    user: Signal<User | undefined>
    following = signal<Paginator<QueryPagination, User>>(default_paginator)
    follower = signal<Paginator<QueryPagination, User>>(default_paginator)

    http: HttpClient = inject(HttpClient)
    accountService: AccountService = inject(AccountService)
    private baseApiUrl = environment.baseUrl + 'api/like/'
    constructor() {
        this.user = computed(() => this.accountService.data()?.user)
    }
    public IsFollowingMember(id: string): boolean {
        const user = this.user()
        if (!user) return false
        const following = (user.following as string[])
        return following.includes(id)
    }


    toggleLike(target_id: string): boolean {

        const user = this.user()
        if (!user) return false
        const url = this.baseApiUrl
        this.http.put(url, { target_id }).subscribe()

        const following = (user.following as string[])
        const isFollowingTarget = following.includes(target_id)
        if (isFollowingTarget) {
            console.log(`remove ${target_id} from following test`)
            user.following = following.filter(id => id !== target_id)

        } else {
            console.log(`add ${target_id} from following list`)
            following.push(target_id)
            user.following = following

        }
        this.accountService.SetUser(user)
        return user.following.includes(target_id)
    }
    getDataFromApi(type: 'following' | 'followers') {
        const setSignal = (cacheData: Paginator<QueryPagination, User>) => {
            if (type === 'following')
                this.following.set(cacheData)
            else
                this.follower.set(cacheData)
        }
        const pagination = type === 'following' ? this.following().pagination : this.follower().pagination
        const key = cacheManager.createKey(pagination)
        const cacheData = cacheManager.load(key, type)
        if (cacheData) {
            console.log(` --> load ${type} data from cache`)
            setSignal(cacheData)
            return
        }
        console.log(` --> load ${type} data from api`)
        const url = this.baseApiUrl + type + pareQuery(pagination)
        this.http.get<Paginator<QueryPagination, User>>(url).subscribe({
            next: response => {
                const key = cacheManager.createKey(response.pagination)
                cacheManager.save(key, response, type)
                this.following.set(response)
            }
        })
    }

    getFollower() {
        this.getDataFromApi('followers')
    }
    getFollowing() {
        this.getDataFromApi('following')
    }
}
