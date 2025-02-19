import { Component, inject, WritableSignal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatFormField } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator'
import { MatSelectModule } from '@angular/material/select'
import { MemberCardComponent } from '../member/member-card/member-card.component'
import { Paginator, UserQueryPagination, default_pageSizeOption, default_paginator } from '../_models/pagination'
import { User } from '../_models/user'
import { LikeService } from '../_services/like.service'

@Component({
  selector: 'app-followers',
  imports: [MemberCardComponent, MatIconModule, MatButtonModule, MatPaginatorModule, MatExpansionModule, FormsModule, MatInputModule, MatFormField, MatSelectModule],
  templateUrl: './followers.component.html',
  styleUrl: './followers.component.scss'
})
export class FollowersComponent {
  private likeService = inject(LikeService)
  followers: WritableSignal<Paginator<UserQueryPagination, User>>
  pageSize = default_pageSizeOption
  constructor() {
    this.followers = this.likeService.follower
  }

  async onSearch() {
    this.likeService.getFollower()
  }

  onResetSearch() {
    this.followers.set(default_paginator)
    this.onSearch()
  }

  onPageChange(event: PageEvent) {
    const copyPaginator = this.followers()
    copyPaginator.pagination.currentPage = event.pageIndex + 1
    copyPaginator.pagination.pageSize = event.pageSize
    this.followers.set(copyPaginator)

    this.onSearch()
  }
}