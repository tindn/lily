//
//  LILYFirebaseStorage.m
//  lily
//
//  Created by Tin D Nguyen on 11/27/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "LILYFirebaseStorage.h"
#import <React/RCTLog.h>
@import Firebase;

@implementation LILYFirebaseStorage
RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(upload:(NSString *)path callback:(RCTResponseSenderBlock)callback)
{
  FIRStorageReference *storageRef = [[[FIRStorage storage] reference] child:[NSString stringWithFormat:@"%@/%@/", @"db_backups", path]];
  NSURL *documentsURL = [[[NSFileManager defaultManager] URLsForDirectory:NSDocumentDirectory inDomains:NSUserDomainMask] lastObject];
  documentsURL = [documentsURL URLByAppendingPathComponent:path];
  
  RCTLogInfo(@"Upload to firebase %@", documentsURL);
  
  
  FIRStorageUploadTask *uploadTask = [storageRef putFile:documentsURL metadata:nil];

  // Listen for state changes, errors, and completion of the upload.
  [uploadTask observeStatus:FIRStorageTaskStatusResume handler:^(FIRStorageTaskSnapshot *snapshot) {
    // Upload resumed, also fires when the upload starts
     RCTLogInfo(@"Start or resume");
  }];

  [uploadTask observeStatus:FIRStorageTaskStatusPause handler:^(FIRStorageTaskSnapshot *snapshot) {
    // Upload paused
    RCTLogInfo(@"paused");
  }];

  [uploadTask observeStatus:FIRStorageTaskStatusProgress handler:^(FIRStorageTaskSnapshot *snapshot) {
    // Upload reported progress
    double percentComplete = 100.0 * (snapshot.progress.completedUnitCount) / (snapshot.progress.totalUnitCount);
  }];

  [uploadTask observeStatus:FIRStorageTaskStatusSuccess handler:^(FIRStorageTaskSnapshot *snapshot) {
    // Upload completed successfully
     RCTLogInfo(@"Upload successful");
  }];

  // Errors only occur in the "Failure" case
  [uploadTask observeStatus:FIRStorageTaskStatusFailure handler:^(FIRStorageTaskSnapshot *snapshot) {
    if (snapshot.error != nil) {
      switch (snapshot.error.code) {
        case FIRStorageErrorCodeObjectNotFound:
          // File doesn't exist
          RCTLogInfo(@"File doesn't exist");
          break;

        case FIRStorageErrorCodeUnauthorized:
          // User doesn't have permission to access file
          RCTLogInfo(@"No permission");
          break;

        case FIRStorageErrorCodeCancelled:
          // User canceled the upload
          RCTLogInfo(@"User cancelled");
          break;

        /* ... */

        case FIRStorageErrorCodeUnknown:
          // Unknown error occurred, inspect the server response
          RCTLogInfo(@"Unknown error");
          break;
      }
    }
  }];

}
@end

