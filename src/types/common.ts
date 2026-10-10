export interface Coordinates {
  latitude: number;
  longitude: number;
}

// Wrapper every repository call returns, so screens never deal with
// raw axios/fetch shapes — mirrors an Angular HttpClient response
// mapped through an interceptor into a consistent envelope.
export interface ApiResult<T> {
  success: boolean;
  data?: T;
  errorCode?: string;
}
