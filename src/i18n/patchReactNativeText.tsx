import React from 'react';
import {getRuntimeLanguage} from './runtimeLanguage';
import {translateText} from './translateText';

let patchInstalled = false;

const translatablePropKeys = [
  'title',
  'label',
  'placeholder',
  'message',
  'actionLabel',
  'accessibilityLabel',
] as const;

const translateString = (value: string): string => {
  return translateText(value, getRuntimeLanguage());
};

const translateNodeLike = (value: unknown): unknown => {
  if (typeof value === 'string') {
    return translateString(value);
  }

  if (Array.isArray(value)) {
    return value.map(item => translateNodeLike(item));
  }

  return value;
};

const translateProps = (
  props?: Record<string, unknown> | null,
): Record<string, unknown> | null | undefined => {
  if (!props) {
    return props;
  }

  const nextProps: Record<string, unknown> = {...props};

  if ('children' in nextProps) {
    nextProps.children = translateNodeLike(nextProps.children);
  }

  for (const key of translatablePropKeys) {
    const value = nextProps[key];
    if (typeof value === 'string') {
      nextProps[key] = translateString(value);
    }
  }

  return nextProps;
};

const patchReactCreateElement = (): void => {
  const originalCreateElement = React.createElement;

  React.createElement = ((
    type: React.ElementType,
    props?: Record<string, unknown> | null,
    ...children: unknown[]
  ) => {
    const translatedChildren = children.map(child => translateNodeLike(child));

    return originalCreateElement(
      type,
      translateProps(props),
      ...(translatedChildren as React.ReactNode[]),
    );
  }) as typeof React.createElement;
};

const patchJsxRuntime = (): void => {
  const jsxRuntime = require('react/jsx-runtime') as {
    jsx: (
      type: React.ElementType,
      props: Record<string, unknown> | null,
      key?: string,
    ) => React.ReactElement;
    jsxs: (
      type: React.ElementType,
      props: Record<string, unknown> | null,
      key?: string,
    ) => React.ReactElement;
  };

  const originalJsx = jsxRuntime.jsx;
  const originalJsxs = jsxRuntime.jsxs;

  jsxRuntime.jsx = (
    type: React.ElementType,
    props: Record<string, unknown> | null,
    key?: string,
  ) => {
    return originalJsx(type, translateProps(props) ?? null, key);
  };

  jsxRuntime.jsxs = (
    type: React.ElementType,
    props: Record<string, unknown> | null,
    key?: string,
  ) => {
    return originalJsxs(type, translateProps(props) ?? null, key);
  };

  try {
    const jsxDevRuntime = require('react/jsx-dev-runtime') as {
      jsxDEV?: (
        type: React.ElementType,
        props: Record<string, unknown> | null,
        key: string | undefined,
        isStaticChildren: boolean,
        source: unknown,
        self: unknown,
      ) => React.ReactElement;
    };

    if (jsxDevRuntime.jsxDEV) {
      const originalJsxDEV = jsxDevRuntime.jsxDEV;
      jsxDevRuntime.jsxDEV = (
        type: React.ElementType,
        props: Record<string, unknown> | null,
        key: string | undefined,
        isStaticChildren: boolean,
        source: unknown,
        self: unknown,
      ) => {
        return originalJsxDEV(
          type,
          translateProps(props) ?? null,
          key,
          isStaticChildren,
          source,
          self,
        );
      };
    }
  } catch {
    // No dev runtime available in production.
  }
};

const patchReactNativeText = (): void => {
  const reactNativeModule = require('react-native') as typeof import('react-native');
  const OriginalText = reactNativeModule.Text;

  const PatchedText = React.forwardRef<any, any>((props, ref) => {
    const nextProps = translateProps(props);
    return <OriginalText ref={ref} {...nextProps} />;
  });

  PatchedText.displayName = 'PatchedText';
  reactNativeModule.Text = PatchedText as unknown as typeof reactNativeModule.Text;
};

export const installReactNativeTextPatch = (): void => {
  if (patchInstalled) {
    return;
  }

  patchReactCreateElement();
  patchJsxRuntime();
  patchReactNativeText();

  patchInstalled = true;
};
