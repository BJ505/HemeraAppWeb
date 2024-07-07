import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideDatabase, getDatabase } from '@angular/fire/database';
import { firebaseConfig } from './environments/environments';

export const firebaseProviders: EnvironmentProviders = makeEnvironmentProviders([
  provideFirebaseApp(() => initializeApp(firebaseConfig.firebaseConfig)),
  provideDatabase(() => getDatabase())
]);