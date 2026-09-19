import{$ as e,H as t}from"./web-D5piyuW3.js";import{l as n}from"./virtual_solid-ssr-entry-client-Behgs3dr.js";import{t as r}from"./components-FIUJQr-n.js";var i=void 0;function a(e){let i={code:`code`,h1:`h1`,h2:`h2`,p:`p`,pre:`pre`,span:`span`,...r(),...e.components};return[t(n,{children:`Migrating from v1 - solid-validation`}),`
`,t(i.h1,{children:`Migrating from v1`}),`
`,t(i.p,{get children(){return[`v2 targets Solid 2. Two things drive every change below: Solid 2 removed `,t(i.code,{children:`use:`}),`
directives, and it batches store writes.`]}}),`
`,t(i.h2,{children:`Directives become ref factories`}),`
`,t(i.p,{get children(){return[t(i.code,{children:`use:validate`}),` and `,t(i.code,{children:`use:formSubmit`}),` are gone, because Solid 2 has no directives.
Each is now a function you call, which returns a ref callback.`]}}),`
`,t(i.pre,{class:`shiki shiki-themes github-light-default github-dark-default`,style:{"--shiki-light":`#1f2328`,"--shiki-dark":`#e6edf3`,"--shiki-light-bg":`#ffffff`,"--shiki-dark-bg":`#0d1117`},tabindex:`0`,get children(){return t(i.code,{get children(){return[t(i.span,{class:`line`,get children(){return t(i.span,{style:{"--shiki-light":`#82071E`,"--shiki-dark":`#FFA198`},children:`-<form use:formSubmit={onSubmit}>`})}}),`
`,t(i.span,{class:`line`,get children(){return t(i.span,{style:{"--shiki-light":`#82071E`,"--shiki-dark":`#FFA198`},children:`-  <input name='email' required use:validate />`})}}),`
`,t(i.span,{class:`line`,get children(){return t(i.span,{style:{"--shiki-light":`#82071E`,"--shiki-dark":`#FFA198`},children:`-  <input name='handle' use:validate={[minLength(3)]} />`})}}),`
`,t(i.span,{class:`line`,get children(){return t(i.span,{style:{"--shiki-light":`#82071E`,"--shiki-dark":`#FFA198`},children:`-</form>`})}}),`
`,t(i.span,{class:`line`,get children(){return t(i.span,{style:{"--shiki-light":`#116329`,"--shiki-dark":`#7EE787`},children:`+<form ref={formSubmit(onSubmit)}>`})}}),`
`,t(i.span,{class:`line`,get children(){return t(i.span,{style:{"--shiki-light":`#116329`,"--shiki-dark":`#7EE787`},children:`+  <input name='email' required ref={validate()} />`})}}),`
`,t(i.span,{class:`line`,get children(){return t(i.span,{style:{"--shiki-light":`#116329`,"--shiki-dark":`#7EE787`},children:`+  <input name='handle' ref={validate(() => [minLength(3)])} />`})}}),`
`,t(i.span,{class:`line`,get children(){return t(i.span,{style:{"--shiki-light":`#116329`,"--shiki-dark":`#7EE787`},children:`+</form>`})}})]}})}}),`
`,t(i.p,{get children(){return[`Destructuring `,t(i.code,{children:`useForm()`}),` is no longer required. The directive compiler needed
the names in scope; a ref factory is an ordinary value, so `,t(i.code,{children:`form.validate(...)`}),`
works as well.`]}}),`
`,t(i.h2,{children:`validators take an accessor`}),`
`,t(i.p,{get children(){return[t(i.code,{children:`validate`}),` takes a function returning the array, not the array itself. The
directive compiler used to insert that wrapper for you.`]}}),`
`,t(i.pre,{class:`shiki shiki-themes github-light-default github-dark-default`,style:{"--shiki-light":`#1f2328`,"--shiki-dark":`#e6edf3`,"--shiki-light-bg":`#ffffff`,"--shiki-dark-bg":`#0d1117`},tabindex:`0`,get children(){return t(i.code,{get children(){return[t(i.span,{class:`line`,get children(){return t(i.span,{style:{"--shiki-light":`#82071E`,"--shiki-dark":`#FFA198`},children:`-use:validate={[minLength(3), noSpaces]}`})}}),`
`,t(i.span,{class:`line`,get children(){return t(i.span,{style:{"--shiki-light":`#116329`,"--shiki-dark":`#7EE787`},children:`+ref={validate(() => [minLength(3), noSpaces])}`})}})]}})}}),`
`,t(i.p,{children:`The wrapper is what makes a conditional rule work, because the array is read
when the field is checked rather than when it mounts:`}),`
`,t(i.pre,{class:`shiki shiki-themes github-light-default github-dark-default`,style:{"--shiki-light":`#1f2328`,"--shiki-dark":`#e6edf3`,"--shiki-light-bg":`#ffffff`,"--shiki-dark-bg":`#0d1117`},tabindex:`0`,get children(){return t(i.code,{get children(){return t(i.span,{class:`line`,get children(){return[t(i.span,{style:{"--shiki-light":`#1F2328`,"--shiki-dark":`#E6EDF3`},children:`<`}),t(i.span,{style:{"--shiki-light":`#116329`,"--shiki-dark":`#7EE787`},children:`input`}),t(i.span,{style:{"--shiki-light":`#0550AE`,"--shiki-dark":`#79C0FF`},children:` ref`}),t(i.span,{style:{"--shiki-light":`#CF222E`,"--shiki-dark":`#FF7B72`},children:`={`}),t(i.span,{style:{"--shiki-light":`#8250DF`,"--shiki-dark":`#D2A8FF`},children:`validate`}),t(i.span,{style:{"--shiki-light":`#1F2328`,"--shiki-dark":`#E6EDF3`},children:`(() `}),t(i.span,{style:{"--shiki-light":`#CF222E`,"--shiki-dark":`#FF7B72`},children:`=>`}),t(i.span,{style:{"--shiki-light":`#1F2328`,"--shiki-dark":`#E6EDF3`},children:` [isRequired, `}),t(i.span,{style:{"--shiki-light":`#8250DF`,"--shiki-dark":`#D2A8FF`},children:`needsMatch`}),t(i.span,{style:{"--shiki-light":`#1F2328`,"--shiki-dark":`#E6EDF3`},children:`() `}),t(i.span,{style:{"--shiki-light":`#CF222E`,"--shiki-dark":`#FF7B72`},children:`&&`}),t(i.span,{style:{"--shiki-light":`#1F2328`,"--shiki-dark":`#E6EDF3`},children:` mustMatch])`}),t(i.span,{style:{"--shiki-light":`#CF222E`,"--shiki-dark":`#FF7B72`},children:`}`}),t(i.span,{style:{"--shiki-light":`#1F2328`,"--shiki-dark":`#E6EDF3`},children:` />`})]}})}})}}),`
`,t(i.p,{get children(){return[t(i.code,{children:`formSubmit`}),` takes the callback directly. Your callback closes over its own
signals and reads them when it runs, so there is nothing to defer.`]}}),`
`,t(i.h2,{children:`validateRef is gone`}),`
`,t(i.p,{get children(){return[`It existed because directives could not cross a component boundary. Ref
factories can, so `,t(i.code,{children:`validate`}),` covers both cases and `,t(i.code,{children:`validateRef`}),` is removed.`]}}),`
`,t(i.pre,{class:`shiki shiki-themes github-light-default github-dark-default`,style:{"--shiki-light":`#1f2328`,"--shiki-dark":`#e6edf3`,"--shiki-light-bg":`#ffffff`,"--shiki-dark-bg":`#0d1117`},tabindex:`0`,get children(){return t(i.code,{get children(){return[t(i.span,{class:`line`,get children(){return t(i.span,{style:{"--shiki-light":`#82071E`,"--shiki-dark":`#FFA198`},children:`-<input ref={props.validateRef(minLength(3), noSpaces)} />`})}}),`
`,t(i.span,{class:`line`,get children(){return t(i.span,{style:{"--shiki-light":`#116329`,"--shiki-dark":`#7EE787`},children:`+<input ref={props.validate(() => [minLength(3), noSpaces])} />`})}})]}})}}),`
`,t(i.p,{children:`Note the arguments become one array inside an accessor.`}),`
`,t(i.h2,{children:`Errors arrive a tick later`}),`
`,t(i.p,{get children(){return[`Solid 2 batches store writes. In v1 a blur on an empty required field put the
message in `,t(i.code,{children:`errors`}),` in the same tick as the event. It now lands on the next
flush.`]}}),`
`,t(i.p,{get children(){return[`Nothing changes for rendering, since anything reading `,t(i.code,{children:`errors.email`}),` in JSX
updates when the write settles. It matters if you read the store imperatively
straight after an event:`]}}),`
`,t(i.pre,{class:`shiki shiki-themes github-light-default github-dark-default`,style:{"--shiki-light":`#1f2328`,"--shiki-dark":`#e6edf3`,"--shiki-light-bg":`#ffffff`,"--shiki-dark-bg":`#0d1117`},tabindex:`0`,get children(){return t(i.code,{get children(){return[t(i.span,{class:`line`,get children(){return[t(i.span,{style:{"--shiki-light":`#1F2328`,"--shiki-dark":`#E6EDF3`},children:`field.`}),t(i.span,{style:{"--shiki-light":`#8250DF`,"--shiki-dark":`#D2A8FF`},children:`dispatchEvent`}),t(i.span,{style:{"--shiki-light":`#1F2328`,"--shiki-dark":`#E6EDF3`},children:`(`}),t(i.span,{style:{"--shiki-light":`#CF222E`,"--shiki-dark":`#FF7B72`},children:`new`}),t(i.span,{style:{"--shiki-light":`#8250DF`,"--shiki-dark":`#D2A8FF`},children:` FocusEvent`}),t(i.span,{style:{"--shiki-light":`#1F2328`,"--shiki-dark":`#E6EDF3`},children:`(`}),t(i.span,{style:{"--shiki-light":`#0A3069`,"--shiki-dark":`#A5D6FF`},children:`'blur'`}),t(i.span,{style:{"--shiki-light":`#1F2328`,"--shiki-dark":`#E6EDF3`},children:`));`})]}}),`
`,t(i.span,{class:`line`,get children(){return[t(i.span,{style:{"--shiki-light":`#1F2328`,"--shiki-dark":`#E6EDF3`},children:`errors.email; `}),t(i.span,{style:{"--shiki-light":`#6E7781`,"--shiki-dark":`#8B949E`},children:`// still undefined here`})]}})]}})}}),`
`,t(i.p,{get children(){return[t(i.code,{children:`validateField`}),` is unaffected. It awaits its own check and reports the result
directly rather than reading the store back.`]}}),`
`,t(i.p,{get children(){return[`In tests, assert with `,t(i.code,{children:`waitFor`}),` rather than immediately after the action.`]}}),`
`,t(i.h2,{children:`Cleared fields leave no key`}),`
`,t(i.p,{get children(){return[`Clearing an error now deletes its key instead of setting it to `,t(i.code,{children:`undefined`}),`, so
`,t(i.code,{children:`Object.keys(errors)`}),` lists only fields that are currently failing. Code that
counts errors or iterates the store sees the difference; code that reads
`,t(i.code,{children:`errors.email`}),` does not.`]}}),`
`,t(i.h2,{children:`Peer dependencies`}),`
`,t(i.p,{get children(){return[t(i.code,{children:`@solidjs/web`}),` joins `,t(i.code,{children:`solid-js`}),` as a peer, since Solid 2 puts the JSX runtime in
a separate package.`]}}),`
`,t(i.pre,{class:`shiki shiki-themes github-light-default github-dark-default`,style:{"--shiki-light":`#1f2328`,"--shiki-dark":`#e6edf3`,"--shiki-light-bg":`#ffffff`,"--shiki-dark-bg":`#0d1117`},tabindex:`0`,get children(){return t(i.code,{get children(){return[t(i.span,{class:`line`,get children(){return[t(i.span,{style:{"--shiki-light":`#0A3069`,"--shiki-dark":`#A5D6FF`},children:`"peerDependencies"`}),t(i.span,{style:{"--shiki-light":`#1F2328`,"--shiki-dark":`#E6EDF3`},children:`: {`})]}}),`
`,t(i.span,{class:`line`,get children(){return[t(i.span,{style:{"--shiki-light":`#116329`,"--shiki-dark":`#7EE787`},children:`  "solid-js"`}),t(i.span,{style:{"--shiki-light":`#1F2328`,"--shiki-dark":`#E6EDF3`},children:`: `}),t(i.span,{style:{"--shiki-light":`#0A3069`,"--shiki-dark":`#A5D6FF`},children:`"^2.0.0"`}),t(i.span,{style:{"--shiki-light":`#1F2328`,"--shiki-dark":`#E6EDF3`},children:`,`})]}}),`
`,t(i.span,{class:`line`,get children(){return[t(i.span,{style:{"--shiki-light":`#116329`,"--shiki-dark":`#7EE787`},children:`  "@solidjs/web"`}),t(i.span,{style:{"--shiki-light":`#1F2328`,"--shiki-dark":`#E6EDF3`},children:`: `}),t(i.span,{style:{"--shiki-light":`#0A3069`,"--shiki-dark":`#A5D6FF`},children:`"^2.0.0"`})]}}),`
`,t(i.span,{class:`line`,get children(){return t(i.span,{style:{"--shiki-light":`#1F2328`,"--shiki-dark":`#E6EDF3`},children:`}`})}})]}})}})]}function o(n={}){let{wrapper:i}={...r(),...n.components};return i?t(i,e(n,{get children(){return t(a,n)}})):a(n)}export{o as default,i as frontmatter};