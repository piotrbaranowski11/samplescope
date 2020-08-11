import { useEffect } from 'react';
import { useSetState } from 'react-use';

import freesoundSearch from '@modules/freesound-search';
import { SampleList } from '@modules/freesound-search/freesound.types';
const apiKey = process.env.SAMPLESCOPE_FREESOUND_API_KEY;

interface State {
  loading: boolean;
  error: boolean;
  samples: SampleList;
  hasMore: boolean;
  meta: Meta;
  nextPageToLoad: URL | null;
}

interface Meta {
  count: number;
  next: URL | null;
  previous: URL | null;
}

interface SearchResponse {
  results: any;
  count: any;
  next: any;
  previous: any;
}

const initMeta: Meta = {
  count: 0,
  next: null,
  previous: null,
};

const initialState: State = {
  loading: true,
  error: false,
  samples: [],
  hasMore: false,
  meta: initMeta,
  nextPageToLoad: null,
};

const useSampleSearch = (query: string) => {
  const [state, setState] = useSetState<State>(initialState);

  useEffect(() => {
    if (!apiKey) {
      // TODO: disaptch Error
    } else freesoundSearch.init(apiKey);
  }, []);

  // clear list when search text changed
  useEffect(() => {
    setState(initialState);
  }, [query]);

  useEffect(() => {
    setState({
      loading: true,
      error: false,
    });

    const abortController = new AbortController();

    (async function() {
      try {
        const freeSoundResponse = await fetchSamples(
          state.nextPageToLoad,
          query,
          abortController
        );

        if (freeSoundResponse) updateSampleList(freeSoundResponse);
      } catch (e) {
        console.dir('fetch error', e.name);
        if (e.name !== 'AbortError') {
          setState({ error: true });
        }
      }
    })();

    // abort last request on new one to avoid spamming API
    // * instead of debounce
    return () => abortController.abort();
  }, [query, state.nextPageToLoad]);

  const fetchSamples = async (
    url: URL | null,
    query: string,
    abortController: AbortController
  ): Promise<SearchResponse | null> => {
    // in case of new search use this
    if (url === null) {
      return freesoundSearch.searchText({
        query,
        abortController,
      });
    } else {
      return freesoundSearch.getByURL(url, abortController);
    }
  };

  const updateSampleList = (freeSoundResponse: SearchResponse) => {
    if (!freeSoundResponse) {
      // throw error  ???
    }

    const newSamples = freeSoundResponse.results;
    const { count, next, previous } = freeSoundResponse;
    const hasMore = next !== null;

    setState(prevState => ({
      samples: [...prevState.samples, ...newSamples],
      hasMore,
      loading: false,
      meta: { count, next, previous },
    }));
  };

  // this will trigger next page loading
  const setNextPageToLoad = () => {
    setState((prevState: State) => ({
      nextPageToLoad: prevState.meta.next,
    }));
  };

  return { ...state, setNextPageToLoad };
};

export default useSampleSearch;