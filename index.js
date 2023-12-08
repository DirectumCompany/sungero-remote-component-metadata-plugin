module.exports = class SungeroRemoteComponentMetadataPlugin {

  constructor(componentManifest) {
    this.componentManifest = componentManifest;
  }

  getPublicName() {
    const regex = /^[_a-zA-Z0-9.\-+]*$/;
    const replaceSymbols = text => text.replace(/[.\-+]/g, '_');
    if (!regex.test(this.componentManifest.vendorName))
      throw new Error(`Vendor name '${this.componentManifest.vendorName}' contains invalid characters`);
    if (!regex.test(this.componentManifest.componentName))
      throw new Error(`Component name '${this.componentManifest.componentName}' contains invalid characters`);
    if (!regex.test(this.componentManifest.componentVersion))
      throw new Error(`Component version '${this.componentManifest.componentVersion}' contains invalid characters`);

    return `${replaceSymbols(this.componentManifest.vendorName)}_${replaceSymbols(this.componentManifest.componentName)}_${replaceSymbols(this.componentManifest.componentVersion)}`;
  }

  getHostApiVersion() {
    const { version } = require(__dirname + '/../sungero-remote-component-types/package.json');
    return version;
  }

  getMetadataFromManifest() {
    return {
      ...this.componentManifest,
      publicName: this.getPublicName(),
      hostApiVersion: this.getHostApiVersion()
    };
  }

  apply(compiler) {
    const { RawSource } = compiler.webpack.sources;
    const metadata = this.getMetadataFromManifest();
    const source = new RawSource(JSON.stringify(metadata));
    compiler.hooks.thisCompilation.tap('SungeroRemoteComponentMetadataPlugin', (compilation) => {
      compilation.emitAsset('metadata.json', source);
    });
  }
};
