import { IPost } from '@gtms/commons/models'

export enum Status {
  isLoading,
  isLoaded,
  isError,
}

export interface IPostDetailsState {
  isOpen: boolean
  status: Status
  post?: IPost
}
