import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  Note: a
    .model({
      name:a.string(),
      description: a.string(),
      image: a.string(),
    }),
    Patient: a
    .model({
      firstName: a.string(),
      lastName: a.string(),
      dob: a.date(),
      weight: a.float(),
      phone: a.phone(),
      email: a.email(),
      fatherName: a.string(),
      motherName: a.string(),
      notes: a.string(),
      visits: a.hasMany('Visit', 'patientId')
    }).secondaryIndexes((index)=> [index('phone').sortKeys(['lastName', 'firstName']).name('byPhone').queryField('patientByPhone'), index('email').sortKeys(['lastName', 'firstName']).name('byEmail').queryField('patientByEmail'), index('dob').sortKeys(['lastName', 'firstName']).name('byDob').queryField('patientByDob')]),
    Visit: a
    .model({
      visitDateTime: a.datetime(),
      reason: a.string(),
      notes: a.string(),
      prescription: a.string(),
      patientId: a.id(),
      patient: a.belongsTo('Patient', 'patientId')
    }),
}).authorization((allow) => [allow.owner()]);

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});
