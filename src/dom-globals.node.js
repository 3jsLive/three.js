import { JSDOM } from "jsdom";

const jsdomOptions = {
	pretendToBeVisual: true,
	storageQuota: 1e9,
	resources: "usable",
	runScripts: "dangerously"
};

const jsdom = new JSDOM(
	`<!DOCTYPE html><body id="main"><p >Hello world</p></body>`,
	jsdomOptions
);

const window = jsdom.window;
export const Blob = window.Blob;
export const atob = window.atob;
export const DOMParser = window.DOMParser;
export const document = window.document;
export const XMLHttpRequest = window.XMLHttpRequest;
export const TextEncoder = window.TextEncoder;
export const TextDecoder = window.TextDecoder;
export const decodeURIComponent = window.decodeURIComponent;
export const CustomEvent = window.CustomEvent;