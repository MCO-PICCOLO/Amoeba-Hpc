import axios from 'axios';

export const postKeyState = async (value: string) => {
  try {
    const relayAPI = axios.create({
      baseURL: '/api-relay',
      timeout: 60000,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
      },
    });
    const payload = { state: value };
    const response = await relayAPI.post('/key-state', payload);
    return {
      data: response.data,
      success: true,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('postKeyState Axios error:');
    } else {
      console.error('postKeyState unknown error:', error);
    }
    throw error;
  } finally {
    console.log('postKeyState API call completed');
  }
};

export const getKeyState = async () => {
  try {
    const relayAPI = axios.create({
      baseURL: '/api-relay',
      timeout: 60000,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
      },
    });
    const response = await relayAPI.get('/key-state');
    return {
      data: response.data,
      success: true,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        'getKeyState Axios error:',
        error.response?.data || error.message,
      );
    } else {
      console.error('getKeyState unknown error:', error);
    }
    throw error;
  } finally {
    console.log('getKeyState API call completed');
  }
};

export const getFlagVideoDisabled = async () => {
  try {
    const relayAPI = axios.create({
      baseURL: '/api-relay',
      timeout: 60000,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
      },
    });
    const response = await relayAPI.get('/flag-video-disabled');
    return {
      data: response.data,
      success: true,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        'getFlagVideoDisabled Axios error:',
        error.response?.data || error.message,
      );
    } else {
      console.error('getFlagVideoDisabled unknown error:', error);
    }
    throw error;
  } finally {
    console.log('getFlagVideoDisabled API call completed');
  }
};

export const getContainerNames = async () => {
  try {
    const relayAPI = axios.create({
      baseURL: '/api-relay',
      timeout: 60000,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
      },
    });
    const response = await relayAPI.get('/container-names');
    return {
      data: response.data,
      success: true,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        'getContainerNames Axios error:',
        error.response?.data || error.message,
      );
    } else {
      console.error('getContainerNames unknown error:', error);
    }
    throw error;
  } finally {
    console.log('getContainerNames API call completed');
  }
};
