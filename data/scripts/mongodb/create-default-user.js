print('===============JAVASCRIPT===============');
print('Count of rows in example collection: ' + db.users.count());

db.users.insert({ name: 'Gailisis', lastname: 'Dawsons', username: 'gailisis', email: 'gailisisdawsons@gmail.com' });

print('===============AFTER JS INSERT==========');
print('Count of rows in test collection: ' + db.test.count());

allUsers = db.users.find();
while (allUsers.hasNext()) {
  printjson(allUsers.next());
}