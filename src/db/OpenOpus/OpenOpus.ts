export interface Root {
    status: Status
    request: Request
    composers: Composer[]
  }
  
  export interface Status {
    success: string
    source: string
    rows: number
    processingtime: number
    api: string
    version: string
  }
  
  export interface Request {
    type: string
  }
  
  export interface Composer {
    name: string
    complete_name: string
    epoch: string
    birth: string
    death: any
    popular: string
    recommended: string
    works: Work[]
  }
  
  export interface Work {
    title: string
    subtitle: string
    searchterms: string
    popular: string
    recommended: string
    genre: string
  }
