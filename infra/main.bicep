@description('Short name prefix (max 11 chars, lowercase alphanumeric) used to build resource names')
@maxLength(11)
param namePrefix string = 'gjresume'

@description('Azure region for the storage account')
param location string = resourceGroup().location

@description('Azure region for the Static Web App — SWA only supports a limited region list, so this is deliberately separate from the storage account region')
param staticWebAppLocation string = 'westeurope'

resource storageAccount 'Microsoft.Storage/storageAccounts@2023-01-01' = {
  name: toLower('${namePrefix}${uniqueString(resourceGroup().id)}')
  location: location
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
}

resource tableService 'Microsoft.Storage/storageAccounts/tableServices@2023-01-01' = {
  parent: storageAccount
  name: 'default'
}

resource visitorTable 'Microsoft.Storage/storageAccounts/tableServices/tables@2023-01-01' = {
  parent: tableService
  name: 'VisitorCounter'
}

resource staticWebApp 'Microsoft.Web/staticSites@2022-09-01' = {
  name: '${namePrefix}-site'
  location: staticWebAppLocation
  sku: {
    name: 'Free'
    tier: 'Free'
  }
  properties: {}
}

resource staticWebAppSettings 'Microsoft.Web/staticSites/config@2022-09-01' = {
  parent: staticWebApp
  name: 'appsettings'
  properties: {
    AZURE_STORAGE_CONNECTION_STRING: 'DefaultEndpointsProtocol=https;AccountName=${storageAccount.name};AccountKey=${storageAccount.listKeys().keys[0].value};EndpointSuffix=core.windows.net'
  }
}

output staticWebAppName string = staticWebApp.name
output staticWebAppUrl string = staticWebApp.properties.defaultHostname
output storageAccountName string = storageAccount.name
