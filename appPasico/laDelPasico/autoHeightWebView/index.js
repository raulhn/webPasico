// https://github.com/cosmotebusinessautomation/react-native-autoheight-webview
// Se realizan cambios para evitar el problema con los defaultProps

import React, { useState, useEffect, forwardRef } from "react";

import { StyleSheet, Platform } from "react-native";

import PropTypes from "prop-types";

import { WebView } from "react-native-webview";

import {
  topic,
  reduceData,
  getWidth,
  isSizeChanged,
  shouldUpdate,
} from "./utils";

const AutoHeightWebView = React.memo(
  forwardRef((props, ref) => {
    const {
      style,
      onMessage,
      onSizeUpdated,
      scrollEnabledWithZoomedin,
      scrollEnabled,
    } = props;

    const [size, setSize] = useState({
      height: style && style.height ? style.height : 0,
      width: getWidth(style),
    });

    const [scrollable, setScrollable] = useState(false);
    const handleMessage = (event) => {
      if (event.nativeEvent) {
        try {
          const data = JSON.parse(event.nativeEvent.data);
          if (data.topic !== topic) {
            onMessage && onMessage(event);
            return;
          }
          const { height, width, zoomedin } = data;
          !scrollEnabled &&
            scrollEnabledWithZoomedin &&
            setScrollable(!!zoomedin);
          const { height: previousHeight, width: previousWidth } = size;
          isSizeChanged({ height, previousHeight, width, previousWidth }) &&
            setSize({
              height,
              width,
            });
        } catch (error) {
          onMessage && onMessage(event);
        }
      } else {
        onMessage && onMessage(event);
      }
    };

    const currentScrollEnabled =
      scrollEnabled === false && scrollEnabledWithZoomedin
        ? scrollable
        : scrollEnabled;

    const { currentSource, script } = reduceData(props);

    const { width, height } = size;
    useEffect(() => {
      onSizeUpdated &&
        onSizeUpdated({
          height,
          width,
        });
    }, [width, height, onSizeUpdated]);

    return React.createElement(WebView, {
      ...props,
      ref,
      onMessage: handleMessage,
      style: [
        styles.webView,
        {
          width,
          height,
        },
        style,
      ],
      injectedJavaScript: script,
      source: currentSource,
      scrollEnabled: currentScrollEnabled,
    });
  }),
  (prevProps, nextProps) => !shouldUpdate({ prevProps, nextProps })
);

AutoHeightWebView.propTypes = {
  onSizeUpdated: PropTypes.func,
  files: PropTypes.arrayOf(
    PropTypes.shape({
      href: PropTypes.string,
      type: PropTypes.string,
      rel: PropTypes.string,
    })
  ),

  customScript: PropTypes.string,
  customStyle: PropTypes.string,
  viewportContent: PropTypes.string,
  scrollEnabledWithZoomedin: PropTypes.bool,
  // webview props
  originWhitelist: PropTypes.arrayOf(PropTypes.string),
  onMessage: PropTypes.func,
  scalesPageToFit: PropTypes.bool,
  source: PropTypes.object,
};

/*  
* Se comenta la parte de DefaultProps debido a problemas de compatibilidad *

let defaultProps = {
  showsVerticalScrollIndicator: false,
  showsHorizontalScrollIndicator: false,
  originWhitelist: ["*"],
};


Platform.OS === "android" &&
  Object.assign(defaultProps, {
    scalesPageToFit: false,
  });

Platform.OS === "ios" &&
  Object.assign(defaultProps, {
    viewportContent: "width=device-width",
  });*/

//AutoHeightWebView.defaultProps = defaultProps;

const styles = StyleSheet.create({
  webView: {
    backgroundColor: "transparent",
  },
});

export default AutoHeightWebView;
