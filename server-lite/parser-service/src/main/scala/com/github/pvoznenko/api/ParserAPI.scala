package com.github.pvoznenko.api

import akka.http.scaladsl.server.Directives._
import ch.megard.akka.http.cors.CorsDirectives._

trait ParserAPI extends {
  val parserRoutes = cors() {
    (path("parse") & get) {
      parameters('utterance) { (utterance) => {
        complete(utterance)
      }
      }
    }
  }
}
