## MAIIA - Frontend Technical Test

First install the project dependencies:

```bash
yarn install
```

Then run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see instructions for the technical test.

## Editor

The instructions work best with Visual Studio Code which provides an API to open local files directly from the browser by clicking a link.

If you favor another text editor providing a similar API feel free to modify `src/components/EditorLink.tsx` to suit your needs.

## Features & Enhancements
- [x] Store Enhancement.
- [x] Redux-Saga.
- [x] Entity Component ( responsible for all apis in the component ).
- [x] API Middleware alongside with redux-saga with api folder combination ( especially in Lookup ).
- [x] Custom Form Flow ( BaseForm - Controlers - validators )
- [x] Cashing stratiegy ( when calling static data like patients - practioners and it will only be loaded on time in the entire App )
- [x] Design grid system ( FormLayout - FormItem ).
- [x] Modal to perform CRUD on Each Appointment.
- [x] Update Prisma API's to use CRUD.
  - [ ] Delete API Is Not working.
- [ ] Enable Notifications after any CRUD operation
- [ ] Enhance Typescript in all files
- [ ] Cypress Test

