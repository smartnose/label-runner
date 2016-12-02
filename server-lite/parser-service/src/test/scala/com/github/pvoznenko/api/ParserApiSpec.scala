package com.github.pvoznenko.api

import akka.http.scaladsl.testkit.ScalatestRouteTest
import org.scalatest.{Matchers, WordSpec}

class ParserApiSpec extends WordSpec with Matchers with ScalatestRouteTest with ParserAPI {
  "return a greeting for GET requests to the root path" in {
    Get("/parse?utterance=test") ~> parserRoutes ~> check {
      val response = responseAs[String]

      response shouldBe "test"
    }

    // Post("/parse?utterance=" +
  }

  def encode(rawParameter: String) = {
    java.net.URLEncoder.encode(rawParameter, "utf-8")
  }
}