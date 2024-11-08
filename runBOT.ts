// runBot.ts
import FormBot from './formBOT';

async function runFormBot() {
  const formUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSfVI-HUcDeZkBdCqIGw08wPvOl7pXRPcEpPjfTWPedTZyMVVg/viewform?fbclid=PAY2xjawGadHRleHRuA2FlbQIxMAABpgC5o0_IIFe4Ef974CDhHUCZmT83l2F_eP84mooxWaWydeOJfrw_sMMFPQ_aem_W29WT5vsZSd0WAHz-hLj1g';
  const bot = new FormBot(formUrl);

  try {
    await bot.init();

    const formData = {
      firstName: 'bacCD]G$,Ly9gX6f{7(RQZb@a;Jc35MR3R*XB&D8P=_+KEwmX2Z0ebu815nyF/[9=q.Pa1qij8z[2m-gJ:L(Lr4H{-j!,ddp4dS]',
      lastName: 'af#2;6KJ:5y0y05p]4NRhQ!Mg@tZ[wTzN=J45u%y/+]c7#i*yFTGq)+v[,_0Vc/N{5x.VB9*Y+2VuAGVr2Pgpi4*SmFAe%{:28d9',
      email: 'j+4[NG.ED&mkywz*#N&3-y}R}gv#(6$DSVr57TUUjrJ:HKRzTD,T:B,}rmiW1YPk3eZBJj4.-.U5PT_B50]dnCvUF3ppY(ajm6&V.m',
      phone: '[E.+JD2rfmw@iR/miqbtEJWK[Ad(b600&TREK!UMJuuhRS&*y86Y*j/+9QQ-pr)%up8)Y7({=Gpa/g[F1+aRpa&hSWg.8:_5?68@',
      message: '/]7Ev-yg_K2]8Ar?V4H{}QE83CjpwPXnxZi-pE1;xMpb5@vr{jWzN0P2(Pa+%w.,{gbQz@dU)?+PYJN&8tb[gJaJpV7YanS4BcY[',
      mensaje: 'T8=4[b-b#c9]4M-RP)!!7&Nu?ZPAuStpuzfQrE(_5%M3.1S3?_7{$iGCquPYPEw_c@w*[)ibKTvi@x(?6ae3NxJEVHMy8?vjFdg='
    };

    await bot.fillForm(formData);
    
    // Esperar unos segundos para ver el resultado
    await new Promise(resolve => setTimeout(resolve, 3000));
    
  } catch (error) {
    console.error('Error running bot:', error);
  } finally {
    await bot.close();
  }
}

runFormBot();