import React from 'react';
import * as ReactDOM from 'react-dom';
import * as _ from 'lodash-es';
import * as d3 from 'd3';
import * as THREE from 'three';
import * as MDStyles from '@material-ui/styles';
import { message } from 'antd';
import { getResourceFile } from '@/utils/file';

const isPreview = () => /\/(bigscreen|shareScreen|insert)/i.test(window.location.pathname);

export const modules: Record<string, any> = {}; // 各模块
export const moduleDependencies: Record<string, any> = {}; // 模块与其依赖的模块的对应关系
export const dependencyModules: Record<string, any> = {}; // 被依赖的模块与依赖此模块的对应关系

/** 加载 JS 文件 */
const loadModule = (name: string, tenantId?: number) => {
  if (name.includes('@')) {
    const basePath = ''; // 基本路径
    const script = document.createElement('script');
    const [moduleName, moduleVersion] = name.split('@');
    if (moduleName && moduleVersion) {
      if (tenantId) {
        script.src = getResourceFile(`${basePath}spaces/${tenantId}/components/${moduleName}/${moduleVersion}/${moduleName}.js`);
      } else {
        script.src = getResourceFile(`${basePath}components/${moduleName}/${moduleVersion}/${moduleName}.js`);
      }
      try {
        document.getElementsByTagName('head')[0].appendChild(script);
        script.onerror = function () {
          message.destroy();
          if (!isPreview()) {
            message.error('组件加载失败');
          }
        };
      } catch (err) {
        console.info('components err ->', err);
      }
    }
  }
};

/** 激活当前模块 */
const runModule = (name: string, dependencies: any[], tenantId?: number) => {
  moduleDependencies[name] = dependencies;
  // 所有依赖是否完成
  if (checkDependencies(name, dependencies, tenantId)) {
    const module = modules[name];
    module.fired = true;
    const res = module.factory.apply(window, getDependencies(name));
    if (res) {
      // return default if exist
      if (res.default) {
        module.exports = res.default;
      } else {
        // return attributes if exist
        let moduleName = name;
        if (moduleName.includes('@')) {
          moduleName = moduleName.split('@')[0];
        }

        if (res[moduleName]) {
          module.exports = res[moduleName];
        } else {
          const upName = moduleName.charAt(0).toUpperCase() + moduleName.slice(1);
          if (res[upName]) {
            module.exports = res[upName];
          } else {
            module.exports = res;
          }
        }
      }
    }
    // 是否有依赖此模块的其他模块
    if (dependencyModules[name]) {
      dependencyModules[name].forEach((item: string) => {
        if (modules[item] && !modules[item].fired) {
          runModule(item, moduleDependencies[item], tenantId);
        }
      });
    }
  }
};

/** 获取所有依赖 */
const getDependencies = (name: string) => {
  if (moduleDependencies[name]) {
    return moduleDependencies[name].map((item: string) => modules[item].exports);
  }
  return [];
};

/** 检查所有依赖加载情况 */
const checkDependencies = (name: string, dependencies: string[], tenantId?: number) => {
  let flag = true;
  dependencies.map((depName) => {

    if (!modules[depName] || !modules[depName].fired) {
      loadModule(depName, tenantId);
      flag = false;
    }

    if (!dependencyModules[depName]) {
      dependencyModules[depName] = [];
    }

    if (!dependencyModules[depName].includes(name)) {
      dependencyModules[depName].push(name);
    }
  });

  return flag;
};

/** 创建 define 方法 */
const define = (name: string, dependencies: any, factory: any, tenantId?: number) => {
  if (typeof name === 'string') {
    if (!modules[name]) {
      modules[name] = { exports: {}, loaded: false, fired: false };
    }

    modules[name].factory = factory;
    modules[name].loaded = true;
    runModule(name, dependencies, tenantId);
  }
};

window.define = define;

// 将公共库引入amd体系
define('react', [], () => ({
  default: React,
}));
define('d3', [], () => ({
  default: d3,
}));
define('lodash', [], () => ({
  default: _,
}));
define('three', [], () => ({
  default: THREE,
}));
define('react-dom', [], () => ({
  default: ReactDOM,
}));
define('@material-ui/styles', [], () => ({
  default: MDStyles,
}));


export { define };
