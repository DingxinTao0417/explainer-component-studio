import sharp from 'sharp';
// Chromium may change a few antialiasing pixels after layer promotion. A small
// RGB tolerance is explicit; missing text, icons or shifted geometry still fail.
export async function comparePixels(a,b){
 const [x,y]=await Promise.all([sharp(Buffer.from(a)).removeAlpha().raw().toBuffer(),sharp(Buffer.from(b)).removeAlpha().raw().toBuffer()]);
 if(x.length!==y.length)return {equal:false,max:255,mean:255,changedFraction:1};
 let max=0,sum=0,changed=0;for(let i=0;i<x.length;i+=3){let p=0;for(let c=0;c<3;c++){const d=Math.abs(x[i+c]-y[i+c]);sum+=d;p=Math.max(p,d);max=Math.max(max,d);}if(p>2)changed++;}
 const mean=sum/x.length,changedFraction=changed/(x.length/3);
 const antialias=max<=32&&mean<=.005&&changedFraction<=.00025;
 const isolatedPixel=changed<=2&&mean<=.0002;
 return {equal:antialias||isolatedPixel,max,mean,changedFraction,changedPixels:changed,exact:sum===0,tolerance:isolatedPixel&&!antialias?'isolated-raster-pixel':'bounded-antialias'};
}
