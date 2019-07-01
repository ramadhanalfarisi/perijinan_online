const Pool = require('pg').Pool
const response = require('./response')
const model = require('./model')
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'perijinan',
  password: 'postgres',
  port: 5433,
})

//INSERT INTO public.tb_pengajuan(id_pengajuan, id_profil, no_pengajuan, waktu_pengajuan, id_status, tanggal_update, "id_jenispengajuan ") VALUES (?, ?, ?, ?, ?, ?, ?);
const getYayasan = (req, res) => {
  let data = {
    id_bag: req.query.id_bag
  }
  pool.query('SELECT * FROM public.tb_profil WHERE id_bagian = 2', (error, results) => {
    if (error) {
      throw error
    }
    response.get("Success Get Data", results.rows, res)
  })
}

const getDisdik = (req, res) => {

  pool.query('SELECT * FROM public.tb_profil WHERE id_bagian = 5', (error, results) => {
    if (error) {
      throw error
    }
    response.get("Success Get Data", results.rows, res)
  })
}

const getProdi = async (req, res) => {

  let array = []

  await pool.query('SELECT a.id_pengajuan,e.jenis_pengajuan, c.nama, a.no_pengajuan, a.waktu_pengajuan, b.arsip, b.id_arsip FROM public.tb_pengajuan a INNER JOIN public.tb_arsip b ON a.id_pengajuan = b.id_pengajuan INNER JOIN public.tb_profil c ON a.id_profil = c.id_profil INNER JOIN public.tb_status d ON a.id_status = d.id_status INNER JOIN public.tb_jenispengajuan e ON a."id_jenispengajuan " = e.id_jenispengajuan', (error, results) => {
    if (error) {
      throw error
    }
    results.rows.map(async (result) => {
      const data = model.getPengajuan()
      data.idPengajuan = result.id_pengajuan
      data.tglPengajuan = result.waktu_pengajuan
      data.namaInstitusi = result.nama
      data.jenisPengajuan = result.jenis_pengajuan
      data.noBerkas = result.no_pengajuan
      data.berkas.idBerkas = result.id_arsip
      data.berkas.namaFile = result.arsip
      data.berkas.tglUpload = result.waktu_pengajuan
      data.berkas.link = "180.250.162.213:3005/upload/" + result.arsip

      await array.push(data)

    })
    response.get("Success Get Data", array, res)
  })
}

const getProdiHafiz = async (req, res) => {

  let array = []
  let array2 = []
  let data = {
    nopengajuan: req.query.nopengajuan
  }


  await pool.query(`SELECT a.waktu_pengajuan, b.arsip, b.id_arsip FROM public.tb_pengajuan a INNER JOIN public.tb_arsip b ON a.id_pengajuan = b.id_pengajuan INNER JOIN public.tb_profil c ON a.id_profil = c.id_profil INNER JOIN public.tb_status d ON a.id_status = d.id_status INNER JOIN public.tb_jenispengajuan e ON a."id_jenispengajuan " = e.id_jenispengajuan WHERE a.no_pengajuan = '${data.nopengajuan}'`, (error, results) => {
    if (error) {
      throw error
    }

    results.rows.map(async (result) => {
      const berkas = model.getBerkas()
      berkas.idBerkas = result.id_arsip
      berkas.namaFile = result.arsip
      berkas.tglUpload = result.waktu_pengajuan
      berkas.link = "180.250.162.213:3005/upload/" + result.arsip
      await array2.push(berkas)
    })

    pool.query(`SELECT a.id_pengajuan,e.jenis_pengajuan,a.id_status, c.nama, a.no_pengajuan, a.waktu_pengajuan, b.arsip, b.id_arsip FROM public.tb_pengajuan a INNER JOIN public.tb_arsip b ON a.id_pengajuan = b.id_pengajuan INNER JOIN public.tb_profil c ON a.id_profil = c.id_profil INNER JOIN public.tb_status d ON a.id_status = d.id_status INNER JOIN public.tb_jenispengajuan e ON a."id_jenispengajuan " = e.id_jenispengajuan WHERE a.no_pengajuan = '${data.nopengajuan}'`, (error, results) => {
      if (error) {
        throw error
      }
  
      results.rows.map((result) => {
        const data = model.getPengajuanHafiz()
        try {
          data.idPengajuan = result.id_pengajuan
          data.tglPengajuan = result.waktu_pengajuan
          data.namaInstitusi = result.nama
          data.jenisPengajuan = result.jenis_pengajuan
          data.noBerkas = result.no_pengajuan
          data.status = result.id_status
          array2.map((result1,index) => {
              data.berkas[index].idBerkas = result1.idBerkas
              data.berkas[index].namaFile = result1.namaFile
              data.berkas[index].tglUpload = result1.tglUpload
              data.berkas[index].link = result1.link
          })
          
        } catch (error) {
            throw error
        }finally{
          array.push(data)
          
        }
  
      })
      response.get("Success Get Data", array[0], res)
    })
  })
}

const getCabdin = (req, res) => {
  let data = {
    id_bag: req.query.id_bag
  }
  pool.query('SELECT * FROM public.tb_profil WHERE id_bagian = 4', (error, results) => {
    if (error) {
      throw error
    }
    response.get("Success Get Data", results.rows, res)
  })
}

const getProfil = (req, res) => {
  let data = {
    id_bag: req.query.id_bag
  }

  if (data.id_bag == "") {
    pool.query('SELECT * FROM public.tb_profil', (error, results) => {
      if (error) {
        throw error
      }
      response.get("Success Get Data", results.rows, res)
    })
  } else {
    pool.query(`SELECT * FROM public.tb_profil WHERE id_bagian = '${data.id_bag}'`, (error, results) => {
      if (error) {
        throw error
      }
      response.get("Success Get Data", results.rows, res)
    })
  }
}


const getOnProgress = (req, res) => {
  let data = {
    id_bag: req.query.id_bag
  }
  pool.query('SELECT * FROM public.tb_pengajuan WHERE id_status != 8', (error, results) => {
    if (error) {
      throw error
    }
    response.get("Success Get Data", results.rows, res)
  })
}


const postProdi = async (req, res) => {
  let data = {
    id_profil: req.body.id_profil,
    id_jenis: req.body.id_jenis,
    no_pengajuan: req.body.no_pengajuan,
    id_jenisCheck: req.body.id_jenisCheck
  }

  let date = new Date();
  let timenow = date.getDate() + "-" + date.getMonth() + 1 + "-" + date.getFullYear();
  let datenow = date.getDate() + "-" + date.getMonth() + 1 + "-" + date.getFullYear();
  let id_pengajuan = 0
  if (req.files) {
  
    var izinGubernur = req.files.izGub, 
    izGub = izinGubernur.name

    var perpIzOperasional = req.files.perpIzOp,
    perpIzOp = perpIzOperasional.name

    var rekCabdinPdkab = req.files.rekCabdinkab,
    rekCabdinkab = rekCabdinPdkab.name

    var profilSek = req.files.profSek, 
    profSek = profilSek.name

    var datJumSis = req.files.jumSis,
    jumSis = datJumSis.name

    var datJadPel = req.files.jadPel,
    jadPel = datJadPel.name

    var daftarPengajar = req.files.dafPengajar, 
    dafPengajar = daftarPengajar.name

    var fotokopiNPSN = req.files.npsn,
    npsn = fotokopiNPSN.name

    var dataSarpra = req.files.Sarpra,
    Sarpra = dataSarpra.name

    var datskKepsek = req.files.skKepsek, 
    skKepsek = datskKepsek.name

    var fotokopiAkTan = req.files.akTanah,
    akTanah = fotokopiAkTan.name

    var fotokopiAktaNot = req.files.akNot,
    akNot = fotokopiAktaNot.name

    var fotoSahKemkumham = req.files.sahKemkumham, 
    sahKemkumham = fotoSahKemkumham.name

    var fotoskSekolah = req.files.skSekolah,
    skSekolah = fotoskSekolah.name

    var fotoPiagamIjin = req.files.piagamIjin,
    piagamIjin = fotoPiagamIjin.name

    var fotoSertifikatAkre = req.files.sertifikatAkre, 
    sertifikatAkre = fotoSertifikatAkre.name

    var fotoRekbank = req.files.rekBank,
    rekBank = fotoRekbank.name

    var surPernyataanKepsek = req.files.perKepsek,
    perKepsek = surPernyataanKepsek.name

    var fotoIjinIMB = req.files.ijinIMB, 
    ijinIMB = fotoIjinIMB.name

    var instrumSupervisi = req.files.insSupervisi,
    insSupervisi = instrumSupervisi.name

    pool.query(`INSERT INTO public.tb_pengajuan(id_profil, no_pengajuan, waktu_pengajuan, id_status, tanggal_update, "id_jenispengajuan ") VALUES ('${data.id_profil}',` + data.no_pengajuan + `,'` + timenow + `', 1,'` + datenow + `', '${data.id_jenis}')`, (error, result) => {

      if (error) {
        throw error
      }

      pool.query(`SELECT * FROM public.tb_pengajuan WHERE no_pengajuan = ${data.no_pengajuan}`,async (err,result) => {
        if(err){
          throw err
        }
        console.log(result.rows[0].id_pengajuan)
        id_pengajuan = await result.rows[0].id_pengajuan

        pool.query(`INSERT INTO public.tb_arsip (arsip,id_jenispengajuan_checklist,id_pengajuan) VALUES 
      ('${izGub}',${data.id_jenisCheck},${id_pengajuan}),
      ('${perpIzOp}',${data.id_jenisCheck},${id_pengajuan}),
      ('${rekCabdinkab}',${data.id_jenisCheck},${id_pengajuan}),
      ('${profSek}',${data.id_jenisCheck},${id_pengajuan}),
      ('${jumSis}',${data.id_jenisCheck},${id_pengajuan}),
      ('${jadPel}',${data.id_jenisCheck},${id_pengajuan}),
      ('${dafPengajar}',${data.id_jenisCheck},${id_pengajuan}),
      ('${npsn}',${data.id_jenisCheck},${id_pengajuan}),
      ('${Sarpra}',${data.id_jenisCheck},${id_pengajuan}),
      ('${skKepsek}',${data.id_jenisCheck},${id_pengajuan}),
      ('${akTanah}',${data.id_jenisCheck},${id_pengajuan}),
      ('${akNot}',${data.id_jenisCheck},${id_pengajuan}),
      ('${sahKemkumham}',${data.id_jenisCheck},${id_pengajuan}),
      ('${skSekolah}',${data.id_jenisCheck},${id_pengajuan}),
      ('${piagamIjin}',${data.id_jenisCheck},${id_pengajuan}),
      ('${sertifikatAkre}',${data.id_jenisCheck},${id_pengajuan}),
      ('${rekBank}',${data.id_jenisCheck},${id_pengajuan}),
      ('${perKepsek}',${data.id_jenisCheck},${id_pengajuan}),
      ('${ijinIMB}',${data.id_jenisCheck},${id_pengajuan}),
      ('${insSupervisi}',${data.id_jenisCheck},${id_pengajuan})`, (error, results) => {
        if (error) {
          throw error
        } else {
          izinGubernur.mv("./upload/" + izGub, function (err) {
            if (err) {
              console.log(err)
            } else {
              console.log("Done!")
            }
          })

          perpIzOperasional.mv("./upload/" + perpIzOp, function (err) {
            if (err) {
              console.log(err)
            } else {
              console.log("Done!")
            }
          })

          rekCabdinPdkab.mv("./upload/" + rekCabdinkab, function (err) {
            if (err) {
              console.log(err)
            } else {
              console.log("Done!")
            }
          })

          profilSek.mv("./upload/" + profSek, function (err) {
            if (err) {
              console.log(err)
            } else {
              console.log("Done!")
            }
          })

          datJumSis.mv("./upload/" + jumSis, function (err) {
            if (err) {
              console.log(err)
            } else {
              console.log("Done!")
            }
          })

          datJadPel.mv("./upload/" + jadPel, function (err) {
            if (err) {
              console.log(err)
            } else {
              console.log("Done!")
            }
          })

          daftarPengajar.mv("./upload/" + dafPengajar, function (err) {
            if (err) {
              console.log(err)
            } else {
              console.log("Done!")
            }
          })

          fotokopiNPSN.mv("./upload/" + npsn, function (err) {
            if (err) {
              console.log(err)
            } else {
              console.log("Done!")
            }
          })

          dataSarpra.mv("./upload/" + Sarpra, function (err) {
            if (err) {
              console.log(err)
            } else {
              console.log("Done!")
            }
          })

          datskKepsek.mv("./upload/" + skKepsek, function (err) {
            if (err) {
              console.log(err)
            } else {
              console.log("Done!")
            }
          })

          fotokopiAkTan.mv("./upload/" + akTanah, function (err) {
            if (err) {
              console.log(err)
            } else {
              console.log("Done!")
            }
          })

          fotokopiAktaNot.mv("./upload/" + akNot, function (err) {
            if (err) {
              console.log(err)
            } else {
              console.log("Done!")
            }
          })

          fotoSahKemkumham.mv("./upload/" + sahKemkumham, function (err) {
            if (err) {
              console.log(err)
            } else {
              console.log("Done!")
            }
          })

          fotoskSekolah.mv("./upload/" + skSekolah, function (err) {
            if (err) {
              console.log(err)
            } else {
              console.log("Done!")
            }
          })

          fotoPiagamIjin.mv("./upload/" + piagamIjin, function (err) {
            if (err) {
              console.log(err)
            } else {
              console.log("Done!")
            }
          })

          fotoSertifikatAkre.mv("./upload/" + sertifikatAkre, function (err) {
            if (err) {
              console.log(err)
            } else {
              console.log("Done!")
            }
          })

          fotoRekbank.mv("./upload/" + rekBank, function (err) {
            if (err) {
              console.log(err)
            } else {
              console.log("Done!")
            }
          })

          surPernyataanKepsek.mv("./upload/" + perKepsek, function (err) {
            if (err) {
              console.log(err)
            } else {
              console.log("Done!")
            }
          })

          fotoIjinIMB.mv("./upload/" + ijinIMB, function (err) {
            if (err) {
              console.log(err)
            } else {
              console.log("Done!")
            }
          })

          instrumSupervisi.mv("./upload/" + insSupervisi, function (err) {
            if (err) {
              console.log(err)
            } else {
              console.log("Done!")
            }
          })
        }

      })
      })

      response.post("Success Upload Data", res)

    })
  }

}

const getLogin = (req, res) => {
  let data = {
    email: req.body.email,
    password: req.body.password
  }
  let i = {
    nama : "",
    nama_bagian : "",
    email : ""
  }
  pool.query(`SELECT b.nama, c.nama_bagian, a.email FROM public.tb_login a INNER JOIN public.tb_profil b ON a.id_profil = b.id_profil INNER JOIN public.tb_bagian c ON b.id_bagian = c.id_bagian WHERE a.email = '${data.email}' AND a.password = '${data.password}'`, (error, results) => {
    if (error) {
      throw error
    }
    
    if (results.rowCount > 0) {
      results.rows.map((result)=>{
        i.nama = result.nama
        i.nama_bagian = result.nama_bagian
        i.email = result.email
      })
      response.get("Success Login",i, res)
    } else {
      response.gagal("Gagal Login", "Akun anda salah", res)
    }

  })
}

const getLoginSMK = (req, res) => {
  let data = {
    email: req.body.email,
    password: req.body.password
  }
  let i = {
    nama : "",
    nama_bagian : "",
    email : ""
  }
  pool.query(`SELECT b.nama, c.nama_bagian, a.email FROM public.tb_login a INNER JOIN public.tb_profil b ON a.id_profil = b.id_profil INNER JOIN public.tb_bagian c ON b.id_bagian = c.id_bagian WHERE a.email = '${data.email}' AND a.password = '${data.password}'`, (error, results) => {
    if (error) {
      throw error
    }
    
    if (results.rowCount > 0) {
      results.rows.map((result)=>{
        i.nama = result.nama
        i.nama_bagian = result.nama_bagian
        i.email = result.email
      })
      response.get("Success Login",i, res)
    } else {
      response.gagal("Gagal Login", "Akun anda salah", res)
    }

  })
}

const getLoginCabdin = (req, res) => {
  let data = {
    email: req.body.email,
    password: req.body.password
  }
  let i = {
    nama : "",
    nama_bagian : "",
    email : ""
  }
  pool.query(`SELECT b.nama, c.nama_bagian, a.email FROM public.tb_login a INNER JOIN public.tb_profil b ON a.id_profil = b.id_profil INNER JOIN public.tb_bagian c ON b.id_bagian = c.id_bagian WHERE a.email = '${data.email}' AND a.password = '${data.password}'`, (error, results) => {
    if (error) {
      throw error
    }
    
    if (results.rowCount > 0) {
      results.rows.map((result)=>{
        i.nama = result.nama
        i.nama_bagian = result.nama_bagian
        i.email = result.email
      })
      response.get("Success Login",i, res)
    } else {
      response.gagal("Gagal Login", "Akun anda salah", res)
    }

  })
}

const getLoginDisdik = (req, res) => {
  let data = {
    email: req.body.email,
    password: req.body.password
  }
  let i = {
    nama : "",
    nama_bagian : "",
    email : ""
  }
  pool.query(`SELECT b.nama, c.nama_bagian, a.email FROM public.tb_login a INNER JOIN public.tb_profil b ON a.id_profil = b.id_profil INNER JOIN public.tb_bagian c ON b.id_bagian = c.id_bagian WHERE a.email = '${data.email}' AND a.password = '${data.password}'`, (error, results) => {
    if (error) {
      throw error
    }
    
    if (results.rowCount > 0) {
      results.rows.map((result)=>{
        i.nama = result.nama
        i.nama_bagian = result.nama_bagian
        i.email = result.email
      })
      response.get("Success Login",i, res)
    } else {
      response.gagal("Gagal Login", "Akun anda salah", res)
    }

  })
}

const getLoginYayasan = (req, res) => {
  let data = {
    email: req.body.email,
    password: req.body.password
  }
  let i = {
    nama : "",
    nama_bagian : "",
    email : ""
  }
  pool.query(`SELECT b.nama, c.nama_bagian, a.email FROM public.tb_login a INNER JOIN public.tb_profil b ON a.id_profil = b.id_profil INNER JOIN public.tb_bagian c ON b.id_bagian = c.id_bagian WHERE a.email = '${data.email}' AND a.password = '${data.password}'`, (error, results) => {
    if (error) {
      throw error
    }
    
    if (results.rowCount > 0) {
      results.rows.map((result)=>{
        i.nama = result.nama
        i.nama_bagian = result.nama_bagian
        i.email = result.email
      })
      response.get("Success Login",i, res)
    } else {
      response.gagal("Gagal Login", "Akun anda salah", res)
    }

  })
}

const getLoginP2T = (req, res) => {
  let data = {
    email: req.body.email,
    password: req.body.password
  }
  let i = {
    nama : "",
    nama_bagian : "",
    email : ""
  }
  pool.query(`SELECT b.nama, c.nama_bagian, a.email FROM public.tb_login a INNER JOIN public.tb_profil b ON a.id_profil = b.id_profil INNER JOIN public.tb_bagian c ON b.id_bagian = c.id_bagian WHERE a.email = '${data.email}' AND a.password = '${data.password}'`, (error, results) => {
    if (error) {
      throw error
    }
    
    if (results.rowCount > 0) {
      results.rows.map((result)=>{
        i.nama = result.nama
        i.nama_bagian = result.nama_bagian
        i.email = result.email
      })
      response.get("Success Login",i, res)
    } else {
      response.gagal("Gagal Login", "Akun anda salah", res)
    }

  })
}

const getP2T = (req, res) => {
  pool.query(`SELECT a.no_pengajuan, a.waktu_pengajuan, a.tanggal_update, b.arsip FROM public.tb_pengajuan a INNER JOIN public.tb_arsip b ON a.id_pengajuan = b.id_pengajuan WHERE "id_jenispengajuan " = 4`, (error, results) => {
    if (error) {
      throw error
    }
    response.get("Success Get Data", results.rows, res)
  })
}

const getDataCabdin = (req, res) => {
  pool.query(`SELECT a.no_pengajuan, a.waktu_pengajuan, a.tanggal_update, b.arsip FROM public.tb_pengajuan a INNER JOIN public.tb_arsip b ON a.id_pengajuan = b.id_pengajuan WHERE "id_jenispengajuan " = 5`, (error, results) => {
    if (error) {
      throw error
    }
    response.get("Success Get Data", results.rows, res)
  })
}

const getSMK = (req, res) => {
  let data = {
    id_bag: req.params.id_bag
  }
  pool.query('SELECT * FROM public.tb_profil WHERE id_bagian = 1', (error, results) => {
    if (error) {
      throw error
    }
    response.get("Success Get Data", results.rows, res)
  })
}
const getUserP2T = (req, res) => {
  let data = {
    id_bag: req.params.id_bag
  }
  pool.query('SELECT * FROM public.tb_profil WHERE id_bagian = 3', (error, results) => {
    if (error) {
      throw error
    }
    response.get("Success Get Data", results.rows, res)
  })
}
const postPerijinanSMK = (req, res) => {
  let data = {
    id_profil: req.query.id_profil,
    nama_pengajuan: req.query.nama_pengajuan,
    no_pengajuan: req.query.no_pengajuan
  }
  let date = new Date();
  let timenow = date.getDate() + "-" + date.getMonth() + 1 + "-" + date.getFullYear();
  let datenow = date.getDate() + "-" + date.getMonth() + 1 + "-" + date.getFullYear();

  pool.query(`INSERT INTO public.tb_pengajuan(id_profil, no_pengajuan, waktu_pengajuan, id_status, tanggal_update, "id_jenispengajuan ") VALUES ('${data.id_profil}',` + data.no_pengajuan + `,'` + timenow + `', 1,'` + datenow + `', '1')`, (error, result) => {

    if (error) {
      throw error
    }

    pool.query(`INSERT INTO public.tb_arsip (arsip,id_jenispengajuan_checklist) VALUES ('${data.nama_pengajuan}_${data.no_pengajuan}',1)`, (error, results) => {
      if (error) {
        throw error
      } else {
        console.log("Success")
      }

    })

    response.post("Success Post Data", res)

  })
}
const postSekolahYayasan = (req, res) => {
  let data = {
    id_profil: req.query.id_profil,
    nama_pengajuan: req.query.nama_pengajuan,
    no_pengajuan: req.query.no_pengajuan
  }
  let date = new Date();
  let timenow = date.getDate() + "-" + date.getMonth() + 1 + "-" + date.getFullYear();
  let datenow = date.getDate() + "-" + date.getMonth() + 1 + "-" + date.getFullYear();

  pool.query(`INSERT INTO public.tb_pengajuan(id_profil, no_pengajuan, waktu_pengajuan, id_status, tanggal_update, "id_jenispengajuan ") VALUES ('${data.id_profil}',` + data.no_pengajuan + `,'` + timenow + `', 1,'` + datenow + `', '3')`, (error, result) => {

    if (error) {
      throw error
    }

    pool.query(`INSERT INTO public.tb_arsip (arsip,id_jenispengajuan_checklist) VALUES ('${data.nama_pengajuan}_${data.no_pengajuan}',1)`, (error, results) => {
      if (error) {
        throw error
      } else {
        console.log("Success")
      }

    })

    response.post("Success Post Data", res)

  })
}
const getDataDisdik = (req, res) => {
  pool.query(`SELECT a.no_pengajuan, a.waktu_pengajuan, a.tanggal_update, b.arsip FROM public.tb_pengajuan a INNER JOIN public.tb_arsip b ON a.id_pengajuan = b.id_pengajuan WHERE "id_jenispengajuan " = 6`, (error, results) => {
    if (error) {
      throw error
    }
    response.get("Success Get Data", results.rows, res)
  })
}


module.exports = {
  getYayasan,
  getProdi,
  getDisdik,
  postProdi,
  getP2T,
  getCabdin,
  getOnProgress,
  getDataCabdin,
  getLogin,
  getLoginSMK,
  getLoginCabdin,
  getLoginDisdik,
  getLoginYayasan,
  getLoginP2T,
  getSMK,
  getUserP2T,
  getDataDisdik,
  postPerijinanSMK,
  postSekolahYayasan,
  getProfil,
  getProdiHafiz
}