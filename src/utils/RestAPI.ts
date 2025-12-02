import axios from "axios";

export const postKeyState = async (value: string) => {
  try {
    console.log("postKeyState called with value:", value);
    const relayAPI = axios.create({
      baseURL: "/api-relay",
      timeout: 60000,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
    const payload = { state: value };
    console.log("postKeyState payload:", payload);
    const response = await relayAPI.post("/key-state", payload);
    console.log("postKeyState response:", response.data);
    return {
      data: response.data,
      success: true,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "postKeyState Axios error:",
        error.response?.data || error.message,
      );
    } else {
      console.error("postKeyState unknown error:", error);
    }
    throw error;
  }
};

export const getKeyState = async () => {
  try {
    const relayAPI = axios.create({
      baseURL: "/api-relay",
      timeout: 60000,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
    // 캐시 방지용 타임스탬프 추가
    const response = await relayAPI.get(`/key-state?_t=${Date.now()}`);
    return {
      data: response.data,
      success: true,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "getKeyState Axios error:",
        error.response?.data || error.message,
      );
    } else {
      console.error("getKeyState unknown error:", error);
    }
    throw error;
  }
};

export const getFlagVideoDisabled = async () => {
  try {
    const relayAPI = axios.create({
      baseURL: "/api-relay",
      timeout: 60000,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
    // 캐시 방지용 타임스탬프 추가
    const response = await relayAPI.get("/flag-video-disabled");
    return {
      data: response.data,
      success: true,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "getFlagVideoDisabled Axios error:",
        error.response?.data || error.message,
      );
    } else {
      console.error("getFlagVideoDisabled unknown error:", error);
    }
    throw error;
  }
};

export const getContainerNames = async () => {
  try {
    const relayAPI = axios.create({
      baseURL: "/api-relay",
      timeout: 60000,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
    // 캐시 방지용 타임스탬프 추가
    const response = await relayAPI.get("/container-names");
    return {
      data: response.data,
      success: true,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "getContainerNames Axios error:",
        error.response?.data || error.message,
      );
    } else {
      console.error("getContainerNames unknown error:", error);
    }
    throw error;
  }
};

export const postDrivingStatus = async (status: string) => {
  try {
    const drivingAPI = axios.create({
      timeout: 60000,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
    const payload = { status: status };
    const response = await drivingAPI.post("/driving-status", payload);
    return {
      data: response.data,
      success: true,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "postDrivingStatus Axios error:",
        error.response?.data || error.message,
      );
    } else {
      console.error("postDrivingStatus unknown error:", error);
    }
    throw error;
  }
};

export const getSound1 = async () => {
  return true;
  // try {
  //   const soundAPI = axios.create({
  //     timeout: 60000,
  //     headers: {
  //       'Content-Type': 'application/json',
  //       Accept: 'application/json',
  //       'Cache-Control': 'no-cache, no-store, must-revalidate',
  //       Pragma: 'no-cache',
  //     },
  //   });
  //   const response = await soundAPI.get('/sound-api/sound1');
  //   return {
  //     data: response.data,
  //     success: true,
  //   };
  // } catch (error) {
  //   if (axios.isAxiosError(error)) {
  //     console.error(
  //       'getSound1 Axios error:',
  //       error.response?.data || error.message,
  //     );
  //   } else {
  //     console.error('getSound1 unknown error:', error);
  //   }
  //   throw error;
  // } finally {
  //   console.log('getSound1 API call completed');
  // }
};

export const getSound2 = async () => {
  return true;
  // try {
  //   const soundAPI = axios.create({
  //     timeout: 60000,
  //     headers: {
  //       'Content-Type': 'application/json',
  //       Accept: 'application/json',
  //       'Cache-Control': 'no-cache, no-store, must-revalidate',
  //       Pragma: 'no-cache',
  //     },
  //   });
  //   const response = await soundAPI.get('/sound-api/sound2');
  //   return {
  //     data: response.data,
  //     success: true,
  //   };
  // } catch (error) {
  //   if (axios.isAxiosError(error)) {
  //     console.error(
  //       'getSound2 Axios error:',
  //       error.response?.data || error.message,
  //     );
  //   } else {
  //     console.error('getSound2 unknown error:', error);
  //   }
  //   throw error;
  // } finally {
  //   console.log('getSound2 API call completed');
  // }
};

export const postYamlArtifact = async (yamlContent: string) => {
  try {
    const yamlAPI = axios.create({
      timeout: 60000,
      headers: {
        "Content-Type": "text/plain",
        Accept: "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
    const response = await yamlAPI.post("/yaml-api/artifact", yamlContent);
    return {
      data: response.data,
      success: true,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "postYamlArtifact Axios error:",
        error.response?.data || error.message,
      );
    } else {
      console.error("postYamlArtifact unknown error:", error);
    }
    throw error;
  }
};

export const postResetDemo = async () => {
  try {
    // reset-pre.yaml 파일 읽기
    const resetPreResponse = await fetch("/resources/demo1121/reset-pre.yaml");
    if (!resetPreResponse.ok) {
      throw new Error(
        `Failed to load reset-pre.yaml: ${resetPreResponse.statusText}`,
      );
    }
    const resetPreYaml = await resetPreResponse.text();

    // reset.yaml 파일 읽기
    const resetResponse = await fetch("/resources/demo1121/reset.yaml");
    if (!resetResponse.ok) {
      throw new Error(`Failed to load reset.yaml: ${resetResponse.statusText}`);
    }
    const resetYaml = await resetResponse.text();

    // 첫 번째 YAML (reset-pre.yaml) 전송
    await postYamlArtifact(resetPreYaml);
    console.log("Reset-pre YAML posted successfully");

    // 두 번째 YAML (reset.yaml) 전송
    await postYamlArtifact(resetYaml);
    console.log("Reset YAML posted successfully");

    return {
      data: "Both YAML files posted successfully",
      success: true,
    };
  } catch (error) {
    console.error("postResetDemo error:", error);
    throw error;
  }
};

export const postScene1 = async () => {
  try {
    // scene-1.yaml 파일 읽기
    const scene1Response = await fetch("/resources/demo1121/scene-1.yaml");
    if (!scene1Response.ok) {
      throw new Error(
        `Failed to load scene-1.yaml: ${scene1Response.statusText}`,
      );
    }
    const scene1Yaml = await scene1Response.text();

    const result = await postYamlArtifact(scene1Yaml);
    console.log("Scene-1 YAML posted successfully");
    return result;
  } catch (error) {
    console.error("postScene1 error:", error);
    throw error;
  }
};

export const postScene2 = async () => {
  try {
    // scene-2.yaml 파일 읽기
    const scene2Response = await fetch("/resources/demo1121/scene-2.yaml");
    if (!scene2Response.ok) {
      throw new Error(
        `Failed to load scene-2.yaml: ${scene2Response.statusText}`,
      );
    }
    const scene2Yaml = await scene2Response.text();

    const result = await postYamlArtifact(scene2Yaml);
    console.log("Scene-2 YAML posted successfully");
    return result;
  } catch (error) {
    console.error("postScene2 error:", error);
    throw error;
  }
};

export const postScene4 = async () => {
  try {
    // scene-4.yaml 파일 읽기
    const scene4Response = await fetch("/resources/demo1121/scene-4.yaml");
    if (!scene4Response.ok) {
      throw new Error(
        `Failed to load scene-4.yaml: ${scene4Response.statusText}`,
      );
    }
    const scene4Yaml = await scene4Response.text();

    const result = await postYamlArtifact(scene4Yaml);
    console.log("Scene-4 YAML posted successfully");
    return result;
  } catch (error) {
    console.error("postScene4 error:", error);
    throw error;
  }
};
